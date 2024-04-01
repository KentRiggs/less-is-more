from models import db
from flask import Flask
from flask_migrate import Migrate
from models import metadata
from flask_restful import Api
from flask_cors import CORS

app = Flask(__name__)

# Configure the SQLAlchemy part of the app instance
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

# Setup Migrate with the app and db instances
migrate = Migrate(app, db)
db.init_app(app)


if __name__ == '__main__':
    app.run(port=5555, debug=True)