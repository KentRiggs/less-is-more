from models import User, Apology, IntendedFor, Category, ApologyCategory
from flask import jsonify, make_response, request, session
from flask_restful import Resource
from config import app, db, api
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
from config import bcrypt 
from sqlalchemy.sql import text

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

        # Check if the username or email already exists
        user_exists = User.query.filter((User.username == data['username']) | (User.email == data['email'])).first()
        if user_exists:
            return make_response(jsonify({"error": "Username or email already exists"}), 409)

        try:
            # Convert the date from string to date object
            data['event_date'] = datetime.strptime(data['event_date'], '%Y-%m-%d').date()
            new_user = User(username=data['username'], email=data['email'], password=data['password'])
            db.session.add(new_user)
            db.session.flush()  # Get the new user ID without committing the transaction

            # Check if the apology ID exists
            if not Apology.query.get(data['apology_id']):
                db.session.rollback()
                return make_response(jsonify({"error": "Apology ID does not exist"}), 404)

            # Create the IntendedFor record
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
    def patch(self, username):
        user = User.query.filter_by(username=username).first_or_404(description='User not found')
        data = request.get_json()

        if 'password' in data and bcrypt.check_password_hash(user.password, data['password']):
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
        else:
            return make_response(jsonify({"error": "Invalid credentials"}), 401)

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
                IntendedFor.event_date
            ).outerjoin(User, User.id == Apology.user_id
            ).join(IntendedFor, IntendedFor.apology_id == Apology.apology_id
            ).all()

            memorials = [
                {
                    "message": f"{result.username if result.username else 'Anonymous'} says {result.apology_text} to {result.recipient} from {result.event_location} on {result.event_date.strftime('%Y-%m-%d')}"
                } for result in results
            ]
            return jsonify(memorials)
        except SQLAlchemyError as e:
            return make_response(jsonify({"error": "Could not fetch memorial data", "message": str(e)}), 400)

api.add_resource(MemorialData, '/memorial-data/')

class Login(Resource):
    def post(self):
        data = request.get_json(force=True)
        user = User.query.filter_by(username=data.get('username')).first()
        if not user:
            return make_response(jsonify({"error": "User not found"}), 404)

        if bcrypt.check_password_hash(user.password, data.get('password')):
            session['user_id'] = user.id
            try:
                user_data = {"username": user.username} 
                return make_response(jsonify(user_data), 200)
            except Exception as e:
                db.session.rollback()
                return make_response(jsonify({"error": "Database error", "message": str(e)}), 500)
        else:
            return make_response(jsonify({"error": "Invalid credentials"}), 401)

api.add_resource(Login, '/login')

class Logout(Resource):
    def delete(self):
        session.pop('user_id', None)  
        return make_response(jsonify({'message': 'Logged out successfully'}), 204)

api.add_resource(Logout, '/logout')

class Register(Resource):
    def post(self):
        data = request.get_json(force=True)

        # Check for existing user by username or email
        if User.query.filter((User.username == data.get('username')) | (User.email == data.get('email'))).first():
            return make_response(jsonify({"error": "Username or email already in use"}), 409)

        # Create new user with hashed password
        new_user = User(
            username=data.get('username'),
            email=data.get('email')
        )
        new_user.password = data.get('password') 

        try:
            db.session.add(new_user)
            db.session.commit()
            # Return minimal user data to confirm creation
            return make_response(jsonify({"message": "User created successfully", "username": new_user.username}), 201)
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Database error", "message": str(e)}), 500)

api.add_resource(Register, '/register')

# class CheckSession(Resource):
#     def get(self):
#         user_id = session.get('user_id')
#         if not user_id:
#             return make_response(jsonify({'error': 'Not Authorized'}), 401)

#         user = User.query.get(user_id)
#         if not user:
#             return make_response(jsonify({'error': 'User not found'}), 404)

#         try:
#             user_info = {"username": user.username}  # Assuming a simple dictionary return
#             return make_response(jsonify(user_info), 200)
#         except Exception as e:
#             return make_response(jsonify({'error': 'Server error', 'message': str(e)}), 500)

# api.add_resource(CheckSession, '/check_session')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
