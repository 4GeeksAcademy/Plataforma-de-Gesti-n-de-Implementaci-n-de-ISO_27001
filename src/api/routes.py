"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, TokenBlockedList
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from flask_bcrypt import Bcrypt

api = Blueprint('api', __name__)

app = Flask(__name__)
bcrypt = Bcrypt(app)

# Allow CORS requests to this API
CORS(api)

@api.route("/user", methods=["POST"])
def user_create():
    try:
        body = request.get_json()
        print(body)

        required_fields = ["usuario", "email", "password", "role"]
        for field in required_fields:
            if field not in body or body[field] is None:
                return jsonify({"msg": f"Debe especificar un {field}"}), 400
        
        user = User.query.filter_by(email=body["email"]).first()
        if user is not None:
            return jsonify({"msg": "Usuario ya existe"}), 400
        
        body["password"] = bcrypt.generate_password_hash(body["password"]).decode("utf-8")
        user = User(usuario=body["usuario"], email=body["email"], password=body["password"], role=body["role"], is_active=True)
        db.session.add(user)
        db.session.commit()
        
        return jsonify({"msg": "Usuario creado", "user": user.serialize()}), 201
    except Exception as e:
        return jsonify({"msg": str(e)}), 500


@api.route("/user", methods=["PUT"])
def user_modified():
    body= request.get_json()

    required_fields = ["email", "usuario", "password", "role"]
    for field in required_fields:
        if field not in body:
            return jsonify({"msg": f"Falta el campo: {field}"}), 400
        
    user = User.query.filter_by(email=body["email"]).first()
    if user is not None:
        user.password = bcrypt.generate_password_hash(body["password"]).decode("utf-8")
        user.usuario = body["usuario"]
        user.role = body["role"]
        db.session.commit()
        return jsonify({"msg": "Usuario modificado", "user": user.serialize()})
    return jsonify({"msg": "Usuario no encontrado"}), 404

@api.route("/settings/email", methods=["POST"])
def update_email_settings():
    body = request.get_json()

    required_fields = ["MAIL_SERVER", "MAIL_PORT", "MAIL_USERNAME", "MAIL_PASSWORD", "MAIL_USE_TLS", "MAIL_USE_SSL"]
    for field in required_fields:
        if field not in body:
            return jsonify({"msg": f"Falta el campo: {field}"}), 400

    app.config['MAIL_SERVER'] = body["MAIL_SERVER"]
    app.config['MAIL_PORT'] = body["MAIL_PORT"]
    app.config['MAIL_USERNAME'] = body["MAIL_USERNAME"]
    app.config['MAIL_PASSWORD'] = body["MAIL_PASSWORD"]
    app.config['MAIL_USE_TLS'] = body["MAIL_USE_TLS"]
    app.config['MAIL_USE_SSL'] = body["MAIL_USE_SSL"]

    return jsonify({"msg": "Configuración de email actualizada correctamente"}), 200
