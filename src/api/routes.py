"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Role, Project, TokenBlockedList
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


@api.route("/register/initial-admin", methods=["POST"])
def register_initial_admin():
    body = request.get_json()
    
    # Verificar campos requeridos.
    required_fields = ["username", "email", "password", "project_name"]
    for field in required_fields:
        if field not in body or body[field] is None:
            return jsonify({"msg": f"Debe especificar un {field}"}), 400
    
    # Verificar si el usuario ya existe
    existing_user = User.query.filter_by(email=body["email"]).first()
    if existing_user:
        return jsonify({"msg": "El usuario ya existe"}), 400

    # Verificar si el proyecto ya existe
    existing_project = Project.query.filter_by(name=body["project_name"]).first()
    if existing_project:
        return jsonify({"msg": "El proyecto ya existe"}), 400
    
    body["password"] = bcrypt.generate_password_hash(body["password"]).decode("utf-8")
    
    # Crear el rol de administrador si no existe
    admin_role = Role.query.filter_by(name='admin').first()
    if not admin_role:
        admin_role = Role(name='admin', description='Administrador con acceso completo')
        db.session.add(admin_role)
        db.session.commit()
    
    # Crear el nuevo usuario administrador
    new_admin = User(
        username=body["username"],
        email=body["email"],
        password=body["password"],
        is_active=True
    )
    new_admin.roles.append(admin_role)
    
    # Crear el proyecto asociado al administrador
    new_project = Project(
        name=body["project_name"],
        description=body.get("project_description", ""),
        admin=new_admin
    )
    
    # Guardar los cambios en la base de datos
    db.session.add(new_admin)
    db.session.add(new_project)
    db.session.commit()
    
    return jsonify({"msg": "Administrador y proyecto creados", "user": new_admin.serialize(), "project": {"name": new_project.name, "description": new_project.description}}), 200