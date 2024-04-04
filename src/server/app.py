from models import User
from flask import jsonify, make_response, request
from flask_restful import Resource
from config import app, db, api

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the API'})

class Users(Resource):
    def post(self):
        data = request.get_json(force=True)
        if not all(key in data for key in ['username', 'email', 'password']):
            return make_response(jsonify({"error": "Missing data"}), 400)
        
        new_user = User(username=data['username'], email=data['email'])
        new_user.password = data['password']

        try:
            db.session.add(new_user)
            db.session.commit()
            return make_response(jsonify(new_user.to_dict()), 201)
        except Exception as e:
            db.session.rollback()
            return make_response(jsonify({"error": "Could not create user", "message": str(e)}), 400)
    
api.add_resource(Users, '/users/')

class UserEdit(Resource):    
    def patch(self, user_id):
        user = User.query.get_or_404(user_id)
        data = request.get_json()

        if 'username' in data:
            user.username = data['username']
        if 'email' in data:
            user.email = data['email']

        db.session.commit()
        return jsonify(user.to_dict()), 200    

    def delete(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'message': 'User not found'}, 404
        
        db.session.delete(user)
        db.session.commit()
        return {'message': 'User deleted'}, 200

api.add_resource(UserEdit, '/users/<int:user_id>')

# class Apologies(Resource):
#     def get(self, apology_id):
#         apology = Apology.query.get(apology_id)
#         if apology is None:
#             return make_response(jsonify(error="Apology not found"), 404)
        
#         return make_response(jsonify(apology.to_dict()), 200)

#     def post(self):
#         data = request.get_json()
#         new_apology = Apology(user_id=data['user_id'], text=data['text'])
#         db.session.add(new_apology)
#         db.session.commit()
#         return make_response(jsonify(new_apology.to_dict()), 201)

#     def put(self, apology_id):
#         apology = Apology.query.get(apology_id)
#         if apology is None:
#             return make_response(jsonify(error="Apology not found"), 404)
        
#         data = request.get_json()
#         apology.text = data.get('text', apology.text)
#         apology.user_id = data.get('user_id', apology.user_id)
        
#         db.session.commit()
#         return make_response(jsonify(apology.to_dict()), 200)

#     def delete(self, apology_id):
#         apology = Apology.query.get(apology_id)
#         if apology is None:
#             return make_response(jsonify(error="Apology not found"), 404)
        
#         db.session.delete(apology)
#         db.session.commit()
#         return make_response('', 204)

# api.add_resource(Apologies, '/apologies/<int:apology_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)