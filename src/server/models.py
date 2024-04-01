from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from datetime import datetime
from sqlalchemy_serializer import SerializerMixin
# from flask_bcrypt import Bcrypt

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules = ('-password', 'apologies', '-apologies.user')

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, unique=True)
    username = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)

    apologies = db.relationship("Apology", backref="user")

    # @property
    # def password_hash(self):
    #     return self._password_hash
    
    # @password_hash.setter
    # def password_hash(self, password):
    #     byte_object = password.encode('utf-8')
    #     bcrypt_hash = bcrypt.generate_password_hash(byte_object)
    #     hash_object_as_string = bcrypt_hash.decode('utf-8')
    #     self._password_hash = hash_object_as_string

    # def authenticate(self, password):
    #     return bcrypt.check_password_hash(self.password_hash, password.encode('utf-8'))

    # def __repr__(self):
    #     return f'<User id={self.id}, username={self.username}>'

class Apology(db.Model, SerializerMixin):
    __tablename__ = 'apologies'

    serialize_rules = ('-user.password', 'intended_for', 'categories.category_name', '-categories.apology')

    apology_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    intended_for = db.relationship("IntendedFor", backref="apology")
    categories = db.relationship("ApologyCategory", backref="apology")

    def __repr__(self):
        return f'<Apology apology_id={self.apology_id}>'

class IntendedFor(db.Model, SerializerMixin):
    __tablename__ = 'intended_for'

    serialize_rules = ('-apology',)

    intended_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    event_date = db.Column(db.Date, nullable=False)
    
    apology_id = db.Column(db.Integer, db.ForeignKey('apologies.apology_id'), nullable=False)

    def __repr__(self):
        return f'<IntendedFor intended_id={self.intended_id}, name={self.name}>'

class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    serialize_rules = ('-apology_categories',)

    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'<Category category_id={self.category_id}, category_name={self.category_name}>'

class ApologyCategory(db.Model, SerializerMixin):
    __tablename__ = 'apology_categories'

    serialize_rules = ('-apology', '-category')

    apology_id = db.Column(db.Integer, db.ForeignKey('apologies.apology_id'), primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'), primary_key=True)