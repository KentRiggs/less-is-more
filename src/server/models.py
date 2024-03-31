from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())

    apologies = relationship("Apology", backref="user")

    def __repr__(self):
        return f'<User user_id={self.user_id}, username={self.username}>'

class Apology(db.Model):
    __tablename__ = 'apologies'

    apology_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    category_id = db.Column(db.Integer, db.ForeignKey('categories.category_id'))
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())

    intended_for = relationship("IntendedFor", backref="apology", uselist=False)
    category = relationship("Category", backref="apologies")

    def __repr__(self):
        return f'<Apology apology_id={self.apology_id}>'

class IntendedFor(db.Model):
    __tablename__ = 'intended_for'

    intended_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    event_date = db.Column(db.Date, nullable=False)
    apology_id = db.Column(db.Integer, db.ForeignKey('apologies.apology_id'))

    def __repr__(self):
        return f'<IntendedFor intended_id={self.intended_id}, name={self.name}>'

class Category(db.Model):
    __tablename__ = 'categories'

    category_id = db.Column(db.Integer, primary_key=True)
    category_name = db.Column(db.String, nullable=False)

    def __repr__(self):
        return f'<Category category_id={self.category_id}, category_name={self.category_name}>'
