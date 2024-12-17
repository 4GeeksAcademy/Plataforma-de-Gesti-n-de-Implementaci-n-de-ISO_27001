"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from sqlalchemy.orm.exc import NoResultFound
from api.models import db, TokenBlockedList
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_jwt_extended import JWTManager
from flask_mail import Mail
import firebase_admin, cloudinary
from firebase_admin import credentials
import cloudinary.uploader
import cloudinary.api

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)

app.url_map.strict_slashes = False

cloudinary.config( 
    cloud_name = os.getenv("CLOUDINARY_CLOUD"), 
    api_key = os.getenv("CLOUDINARY_KEY"), 
    api_secret = os.getenv("CLOUDINARY_SECRET"),
    secure=True
)

app.config['MAIL_SERVER'] = 'mx.consultancysecurity.com'  # Cambia por tu servidor SMTP
app.config['MAIL_PORT'] = 587  # Cambia según tu configuración
app.config['MAIL_USERNAME'] = 'notificacion@consultancysecurity.com'
app.config['MAIL_PASSWORD'] = 's^6rGE%@7^4S02t9%l@1XQ1kOXA^56'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_DEFAULT_SENDER'] = 'notificacion@consultancysecurity.com'

mail = Mail(app)
mail.init_app(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET")
jwt = JWTManager(app)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    token_type = jwt_payload.get("type")
    jti = jwt_payload.get("jti")
    if not jti:
        return False
    if token_type == "password" and request.path != "/api/changepassword":
        return True
    try:
        token = TokenBlockedList.query.filter_by(jti=jti).first()
        return token is not None
    except NoResultFound:
        return False

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object

@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints

@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file

@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
