from models import db
from flask import Flask, jsonify, make_response, request
from flask_migrate import Migrate
from flask_restful import Api, Resource

app = Flask(__name__)
api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

migrate = Migrate(app, db)
db.init_app(app)

class Users(Resource):
    def get(self, user_id):
        user = Users.query.get(user_id)
        if user is None:
            return make_response(jsonify(error="User not found"), 404)
        return make_response(jsonify(user.to_dict()), 200)

    def post(self):
        data = request.get_json()
        new_user = Users(username=data['username'], email=data['email'], password=data['password'])
        db.session.add(new_user)
        db.session.commit()
        return make_response(jsonify(new_user.to_dict()), 201)

    def put(self, user_id):
        user = Users.query.get(user_id)
        if user is None:
            return make_response(jsonify(error="User not found"), 404)
        
        data = request.get_json()
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.password = data.get('password', user.password)
        db.session.commit()
        return make_response(jsonify(user.to_dict()), 200)

    def delete(self, user_id):
        user = Users.query.get(user_id)
        if user is None:
            return make_response(jsonify(error="User not found"), 404)
        
        db.session.delete(user)
        db.session.commit()
        return make_response('', 204)

api.add_resource(Users, '/users/<int:user_id>', '/users')

class Apologies(Resource):
    def get(self, apology_id):
        apology = Apologies.query.get(apology_id)
        if apology is None:
            return make_response(jsonify(error="Apology not found"), 404)
        
        apology_data = {
            "apology_id": apology.apology_id,
            "user_id": apology.user_id,
            "text": apology.text,
            
            "intended_for": [intended.to_dict() for intended in apology.intended_for],
            "categories": [category.to_dict() for category in apology.categories]
        }
        return make_response(jsonify(apology_data), 200)

    def post(self):
        data = request.get_json()
        new_apology = Apologies(user_id=data['user_id'], text=data['text'])
        db.session.add(new_apology)
        db.session.commit()
        return make_response(jsonify(new_apology.to_dict()), 201)

    def put(self, apology_id):
        apology = Apologies.query.get(apology_id)
        if apology is None:
            return make_response(jsonify(error="Apology not found"), 404)
        
        data = request.get_json()
        apology.text = data.get('text', apology.text)
        apology.user_id = data.get('user_id', apology.user_id)
        
        db.session.commit()
        return make_response(jsonify(apology.to_dict()), 200)

    def delete(self, apology_id):
        apology = Apologies.query.get(apology_id)
        if apology is None:
            return make_response(jsonify(error="Apology not found"), 404)
        
        db.session.delete(apology)
        db.session.commit()
        return make_response('', 204)

api.add_resource(Apologies, '/apologies/<int:apology_id>', endpoint='apology')

if __name__ == '__main__':
    app.run(port=5555, debug=True)