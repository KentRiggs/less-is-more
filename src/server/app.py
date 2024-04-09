from models import User, Apology, IntendedFor, Category, ApologyCategory
from flask import jsonify, make_response, request
from flask_restful import Resource
from config import app, db, api
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

class Users(Resource):
    def post(self):
        data = request.get_json(force=True)
        required_fields = ['username', 'email', 'password']
        if not all(field in data for field in required_fields):
            return make_response(jsonify({"error": "Missing data for required fields"}), 400)

        new_user = User(username=data['username'], email=data['email'], password=data['password'])
        try:
            db.session.add(new_user)
            db.session.commit()
            return make_response(jsonify(new_user.to_dict()), 201)
        except SQLAlchemyError as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Could not create user", "message": str(e)}), 400)
    
api.add_resource(Users, '/users/')

class Apologies(Resource):
    def post(self):
        data = request.get_json()
        if 'apology_text' not in data:
            return make_response(jsonify({"error": "Missing apology text"}), 400)
        category_ids = data.get('category_ids', [])

        new_apology = Apology(apology_text=data['apology_text'])
        db.session.add(new_apology)
        db.session.flush()

        for category_id in category_ids:
            if not db.session.query(Category.category_id).filter_by(category_id=category_id).scalar():
                continue
            new_apology_category = ApologyCategory(apology_id=new_apology.apology_id, category_id=category_id)
            db.session.add(new_apology_category)

        db.session.commit()
        return make_response(jsonify({"apology_id": new_apology.apology_id, "message": "Apology created successfully"}), 201)

api.add_resource(Apologies, '/apologies/')

class UsersWithApology(Resource):
    def post(self):
        data = request.get_json(force=True)
        required_fields = ['username', 'email', 'password', 'recipient', 'event_date', 'event_location', 'apology_id']
        if not all(field in data for field in required_fields):
            return make_response(jsonify({"error": "Missing data for required fields"}), 400)

        try:
            data['event_date'] = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
            new_user = User(username=data['username'], email=data['email'], password=data['password'])
            db.session.add(new_user)
            db.session.flush()

            if not Apology.query.get(data['apology_id']):
                return make_response(jsonify({"error": "Apology ID does not exist"}), 404)

            new_intended_for = IntendedFor(
                recipient=data['recipient'],
                event_location=data['event_location'],
                event_date=data['event_date'],
                apology_id=data['apology_id'],
            )
            db.session.add(new_intended_for)
            db.session.commit()
            return make_response(jsonify({"message": "User and apology associated successfully", "user_id": new_user.id}), 201)

        except SQLAlchemyError as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Could not process request", "message": str(e)}), 400)

api.add_resource(UsersWithApology, '/users_with_apology/')

class UserDetails(Resource):
    def get(self, username):
        user = User.query.filter_by(username=username).first_or_404(description='User not found')
        return make_response(jsonify(user.to_dict()), 200)

    def patch(self, username):
        user = User.query.filter_by(username=username).first_or_404(description='User not found')
        data = request.get_json()

        # Update user fields
        user_fields = ['username', 'email']
        for field in user_fields:
            if field in data:
                setattr(user, field, data[field])

        try:
            db.session.commit()
            return make_response(jsonify(user.to_dict()), 200) 
        except SQLAlchemyError as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Could not update user", "message": str(e)}), 400)

api.add_resource(UserDetails, '/user-details/<string:username>')

# class ApologyDetails(Resource):
#     def get(self, apology_id):
#         apology = Apology.query.get_or_404(apology_id)
#         user = User.query.get_or_404(apology.user_id)
#         return jsonify({
#             'username': user.username,
#             'email': user.email,
#             'apology_text': apology.apology_text
#         })

#     def patch(self, apology_id):
#         apology = Apology.query.get_or_404(apology_id)
#         user = User.query.get_or_404(apology.user_id)
#         data = request.get_json()
#         if 'username' in data:
#             user.username = data['username']
#         if 'email' in data:
#             user.email = data['email']
#         if 'apology_text' in data:
#             apology.apology_text = data['apology_text']
#         db.session.commit()
#         return jsonify({'message': 'Updated successfully'})

# api.add_resource(ApologyDetails, '/apology-details/<int:apology_id>')

class Categories(Resource):
    def get(self):
        try:
            categories = Category.query.all()
            return jsonify([{'category_id': category.category_id, 'category_name': category.category_name} for category in categories])
        except SQLAlchemyError as e:
            return make_response(jsonify({"error": "Could not fetch categories", "message": str(e)}), 400)

api.add_resource(Categories, '/categories/')

class MemorialData(Resource):
    def get(self):
        try:
           
            results = db.session.query(
                User.username,
                Apology.apology_text,
                IntendedFor.recipient,
                IntendedFor.event_location,
                IntendedFor.event_date,
                Category.category_name
            ).join(Apology, User.id == Apology.user_id  
            ).join(IntendedFor, Apology.apology_id == IntendedFor.apology_id  
            ).join(ApologyCategory, ApologyCategory.apology_id == Apology.apology_id  
            ).join(Category, ApologyCategory.category_id == Category.category_id  
            ).all()
   
            memorials = [
                {
                    "message": f"{result.username} says {result.apology_text} to {result.recipient} from {result.event_location} on {result.event_date.strftime('%Y-%m-%d')} in category {result.category_name}"
                } for result in results
            ]
            return jsonify(memorials)
        except SQLAlchemyError as e:
            return make_response(jsonify({"error": "Could not fetch memorial data", "message": str(e)}), 400)

api.add_resource(MemorialData, '/memorial-data/')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
