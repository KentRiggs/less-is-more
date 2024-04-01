from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy(metadata=metadata)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    apologies = db.relationship("Apology", backref="user")

    def __repr__(self):
        return f'<User id={self.id}, username={self.username}>'

class Apology(db.Model):
    __tablename__ = 'apologies'
    apology_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)

    intended_for = db.relationship("IntendedFor", backref="apology")
    categories = db.relationship("ApologyCategory", backref="apology")

    def __repr__(self):
        return f'<Apology apology_id={self.apology_id}>'

class IntendedFor(db.Model):
    __tablename__ = 'intended_for'
    intended_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    event_date = db.Column(db.Date, nullable=False)
    
    apology_id = db.Column(db.Integer, db.ForeignKey('apologies.apology_id'), nullable=False)

    def __repr__(self):
        return f'<IntendedFor intended_id={self.intended_id}, name={self.name}>'

class Category(db.Model):
    __tablename__ = 'categories'
    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'<Category category_id={self.category_id}, category_name={self.category_name}>'

class ApologyCategory(db.Model):
    __tablename__ = 'apology_categories'
    apology_id = db.Column(db.Integer, db.ForeignKey('apologies.apology_id'), primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'), primary_key=True)