# server/seed.py

from datetime import datetime
from app import app
from models import db, User, Apology, IntendedFor, Category, ApologyCategory

def seed():
    with app.app_context():
        # Delete all rows in tables, respecting foreign key constraints order
        ApologyCategory.query.delete()
        IntendedFor.query.delete()
        Apology.query.delete()
        User.query.delete()
        Category.query.delete()
        db.session.commit()

        # Seed Users
        user1 = User(username="UserOne", password="Pass123")
        user2 = User(username="UserTwo", password="Pass456")
        db.session.add_all([user1, user2])
        db.session.commit()

        # Seed Categories
        category1 = Category(category_name="Personal")
        category2 = Category(category_name="Professional")
        db.session.add_all([category1, category2])
        db.session.commit()

        # Seed Apologies
        apology1 = Apology(user_id=user1.id, text="I'm sorry for the delay.")
        apology2 = Apology(user_id=user2.id, text="I apologize for any inconvenience caused.")
        db.session.add_all([apology1, apology2])
        db.session.commit()

        # Seed IntendedFor
        intended1 = IntendedFor(name="Alice", location="Office", event_date=datetime.today(), apology_id=apology1.apology_id)
        intended2 = IntendedFor(name="Bob", location="Headquarters", event_date=datetime.today(), apology_id=apology2.apology_id)
        db.session.add_all([intended1, intended2])
        db.session.commit()

        # Seed ApologyCategories
        apologyCategory1 = ApologyCategory(apology_id=apology1.apology_id, category_id=category1.category_id)
        apologyCategory2 = ApologyCategory(apology_id=apology2.apology_id, category_id=category2.category_id)
        db.session.add_all([apologyCategory1, apologyCategory2])
        db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        seed()


