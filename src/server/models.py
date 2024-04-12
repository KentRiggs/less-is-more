from datetime import datetime
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-password', 'id', 'username', '-apologies.user')

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, unique=True)
    username = db.Column(db.String, nullable=False)
    _password_hash = db.Column(db.String(128), nullable=False)

    apologies = db.relationship("Apology", backref="user")

    @property
    def password(self):
        return self._password_hash

    @password.setter
    def password(self, password):
        self._password_hash = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def to_dict(self):
        return {"id": self.id, "email": self.email, "username": self.username}

    def __repr__(self):
        return f'<User id={self.id}, username={self.username}>'

class Apology(db.Model, SerializerMixin):
    __tablename__ = 'apologies'

    serialize_rules = ('-intended_for.apology', 'apology_id', 'apology_text', 'apology_created_at', '-user.apologies', '-apology_categories.apology', '-categories')

    apology_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    apology_text = db.Column(db.Text, nullable=False)
    apology_created_at = db.Column(db.DateTime, default=datetime.now)

    intended_for = db.relationship("IntendedFor", backref="apology")
    apology_categories = db.relationship("ApologyCategory", backref="apology")

    categories = association_proxy('apology_categories', 'category')

    def recipients(self):
        names = "".join([intended.recipient for intended in self.intended_for])
        return f"{names} from {self.intended_for[0].event_location} ON {self.intended_for[0].event_date.strftime('%Y-%m-%d')}"
        
#  {apology.intended_for.recipient} from {apology.intended_for.event_location} on {

    def __repr__(self):
        return f'<Apology apology_id={self.apology_id}>'

class IntendedFor(db.Model, SerializerMixin):
    __tablename__ = 'intended_for'

    serialize_rules = ('event_location', 'event_date', 'id', 'recipient')

    id = db.Column(db.Integer, primary_key=True)
    recipient = db.Column(db.String, nullable=False)
    event_location = db.Column(db.String, nullable=False)
    event_date = db.Column(db.Date, nullable=False)
    
    apology_id = db.Column(db.Integer, db.ForeignKey('apologies.apology_id'), nullable=False)

    def __repr__(self):
        return f'<IntendedFor intended_id={self.id}, name={self.recipient}>'

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    serialize_rules = ('category_id', 'category_name', '-apologies.categories')

    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'<Category category_id={self.category_id}, category_name={self.category_name}>'

class ApologyCategory(db.Model, SerializerMixin):
    __tablename__ = 'apology_categories'

    apology_id = db.Column(db.Integer, db.ForeignKey('apologies.apology_id'), primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'), primary_key=True)

    category = db.relationship("Category")