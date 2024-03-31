from flask import Flask 
from flask_sqlalchemy import SQLAlchemy 
from flask_migrate import Migrate
from sqlalchemy import MetaData
from flask_restful import Api
from flask_cors import CORS

# Define the naming convention for the metadata
metadata = MetaData(naming_convention={
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
})

app = Flask(__name__)

# Configure the SQLAlchemy part of the app instance
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy with the app and the custom metadata
db = SQLAlchemy(app, metadata=metadata)

# Setup Migrate with the app and db instances
Migrate(app, db)

# Initialize Flask-Restful and Flask-CORS
api = Api(app)
CORS(app)
