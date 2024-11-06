"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Role, Project, UserProjectRole, TokenBlockedList
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

        required_fields = ["username", "email", "password"]
        for field in required_fields:
            if field not in body or body[field] is None:
                return jsonify({"msg": f"Debe especificar un {field}"}), 400

        user = User.query.filter_by(email=body["email"]).first()
        if user is not None:
            return jsonify({"msg": "Usuario ya existe"}), 400

        body["password"] = bcrypt.generate_password_hash(body["password"]).decode("utf-8")
        user = User(username=body["username"], email=body["email"], password=body["password"], is_active=True)
        db.session.add(user)
        db.session.commit()

        return jsonify({"msg": "Usuario creado", "user": user.serialize()}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

@api.route("/user", methods=["PUT"])
def user_modified():
    body= request.get_json()

    required_fields = ["email", "full_name", "password", "role"]
    for field in required_fields:
        if field not in body:
            return jsonify({"msg": f"Falta el campo: {field}"}), 400
        
    user = User.query.filter_by(email=body["email"]).first()
    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404
        
    user.full_name = body["full_name"]
    user.password = bcrypt.generate_password_hash(body["password"]).decode("utf-8")
    user.email = body["email"]
       
    role_to_assign = Role.query.filter_by(name=body["role"]).first()
    if not role_to_assign:
        return jsonify({"msg": "Rol no encontrado"}), 404
    
    # Evitar que se asigne el rol de Administrador de Plataforma
    if role_to_assign.name == "Administrador de Plataforma":
        return jsonify({"msg": "No se puede asignar el rol de Administrador de Plataforma"}), 403

    user.global_role = role_to_assign
        
    db.session.commit()
    return jsonify({"msg": "Usuario modificado", "user": user.serialize()}),200
    

@api.route("/user", methods=["DELETE"])
def user_delete():
    try:
        body = request.get_json()
        email = body.get("email")

        if not email:
            return jsonify({"msg": "Debe especificar un email"}), 400

        user = User.query.filter_by(email=email).first()
        if user is None:
            return jsonify({"msg": "Usuario no existe"}), 404

        # Verificar que el usuario no sea un Administrador de Plataforma
        if user.global_role and user.global_role.name == "Administrador de Plataforma":
            return jsonify({"msg": "No se puede eliminar un Administrador de Plataforma"}), 403
        
        db.session.delete(user)
        db.session.commit()

        return jsonify({"msg": "Usuario eliminado"}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

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


@api.route("/register", methods=["POST"])
def register_user():
    body = request.get_json()

    
    required_fields = ["email", "password", "full_name"]
    for field in required_fields:
        if field not in body or not body[field]:
            return jsonify({"msg": f"Falta el campo: {field}"}), 400

    
    existing_user = User.query.filter_by(email=body["email"]).first()
    if existing_user:
        return jsonify({"msg": "El usuario ya existe"}), 400

    
    hashed_password = bcrypt.generate_password_hash(body["password"]).decode("utf-8")

    
    new_user = User(
        email=body["email"],
        password=hashed_password,
        full_name=body["full_name"],
        is_active=True,
        global_role=None  # No se asigna un rol global
    )

    # Si es el primer usuario, asignarle rol de Administrador de Plataforma
    if User.query.count() == 0:

        # Verificar si el rol "Administrador de Plataforma" existe en la tabla `Role`
        admin_role = Role.query.filter_by(name='Administrador de Plataforma').first()
        if not admin_role:
            # Crear el rol si no existe
            admin_role = Role(name='Administrador de Plataforma', description='Acceso completo a la plataforma')
            db.session.add(admin_role)
            db.session.commit()

        # Asignar el rol "Administrador de Plataforma" al primer usuario
        new_user.global_role = admin_role
    
    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "msg": "Usuario registrado exitosamente",
        "user": new_user.serialize()
    }), 200
