"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from datetime import timedelta
from api.models import db, User, Role, Project, TokenBlockedList
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message

api = Blueprint('api', __name__)

app = Flask(__name__)
bcrypt = Bcrypt(app)

app.config['MAIL_SERVER'] = 'mx.consultancysecurity.com'  # Cambia por tu servidor SMTP
app.config['MAIL_PORT'] = 587  # Cambia según tu configuración
app.config['MAIL_USERNAME'] = 'notificacion@consultancysecurity.com'
app.config['MAIL_PASSWORD'] = 's^6rGE%@7^4S02t9%l@1XQ1kOXA^56'
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_DEFAULT_SENDER'] = 'notificacion@consultancysecurity.com'

mail = Mail(app)

# Allow CORS requests to this API
CORS(api)

@api.route("/user", methods=["POST"])
def user_create():
    try:
        body = request.get_json()

        required_fields = ["full_name", "email", "password"]
        for field in required_fields:
            if field not in body or body[field] is None:
                return jsonify({"msg": f"Debe especificar un {field}"}), 400

        user = User.query.filter_by(email=body["email"]).first()
        if user is not None:
            return jsonify({"msg": "Usuario ya existe"}), 400

        body["password"] = bcrypt.generate_password_hash(body["password"]).decode("utf-8")
        user = User(full_name=body["full_name"], email=body["email"], password=body["password"], is_active=True)
        db.session.add(user)
        db.session.commit()

        return jsonify({"msg": "Usuario creado", "user": user.serialize()}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

@api.route("/user", methods=["PATCH"])
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

@api.route('/forgotpassword', methods=['POST'])
def forgot_password(): 
    try:
        body = request.get_json()

        if 'email' not in body:
            return jsonify({"message": "Se requiere un correo electrónico"}), 400
        user = User.query.filter_by(email=body['email']).first()
        if user is None:
            return jsonify({"message": "El correo electrónico no está registrado"}), 404
        reset_token = create_access_token(identity=user.id, additional_claims={"Type": "Password"}, expires_delta=timedelta(minutes=15))
        reset_url = f"https://literate-waffle-rrqp9gxq9wp259jx-3001.app.github.dev/api/reset-password/{reset_token}"
        msg = Message("CerBro - Recuperación de contraseña", recipients=[user.email])
        msg.body = f"Hola {user.full_name},\n\nHaz clic en el siguiente enlace para restablecer tu contraseña:\n{reset_url}\n\nEste enlace expira en 15 minutos."
        mail.send(msg)
        return jsonify({"message": "Correo de recuperación enviado"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    
@api.route('/changepassword', methods=['PATCH'])
@jwt_required()
def change_password():
    try:
        body = request.get_json()
        if 'current_password' not in body or 'new_password' not in body:
            return jsonify({"message": "Se requiere la contraseña actual y la nueva contraseña"}), 400
        user_id = get_jwt_identity()
        
        user = User.query.get_or_404(user_id)
        if not bcrypt.check_password_hash(user.password, body['current_password']):
            return jsonify({"message": "Contraseña actual incorrecta"}), 401
        if len(body['new_password']) < 6:
            return jsonify({"message": "La nueva contraseña debe tener al menos 6 caracteres"}), 400
        
        hashed_password = bcrypt.generate_password_hash(body['new_password']).decode('utf-8')
        user.password = hashed_password
        db.session.commit()
        
        return jsonify({"message": "Contraseña actualizada exitosamente"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

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

@api.route("/project", methods=["POST"])
@jwt_required()
def project_create():
    try:
        body = request.get_json()

        required_fields = ["projectName", "companyName", "projectDescription"]
        for field in required_fields:
            if field not in body or body[field] is None:
                return jsonify({"msg": f"Debe especificar un {field}"}), 400

        project = Project.query.filter_by(name=body["projectName"]).first()
        if project is not None:
            return jsonify({"msg": "El proyecto ya existe"}), 400

        # Obtener el ID del admin desde el token JWT
        #admin_id = get_jwt_identity()  # Esto devuelve el `admin_id` del payload del token

        new_project = Project(
            name=body["projectName"],
            description=body.get("projectDescription", ""),
            company_name=body["companyName"]
        )

        db.session.add(new_project)
        db.session.commit()

        return jsonify({"msg": "Proyecto creado", "project": new_project.serialize()}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500



@api.route("/register/initial-admin", methods=["POST"])
def register_initial_admin():
    body = request.get_json()
    
    # Verificar campos requeridos.
    required_fields = ["full_name", "email", "password", "project_name"]
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
        full_name=body["full_name"],
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

@api.route("/login", methods=['POST'])
def user_login():
    body = request.get_json()

    if body.get("email") is None:
        return jsonify({"message": "You must enter an email"}), 400
    if body.get("password") is None:
        return jsonify({"message": "You must enter a password"}), 400

    user = User.query.filter_by(email=body["email"]).first()
    if user is None:
        return jsonify({"message": "User not found"}), 400
    if user.role.name is None:
        return jsonify({"message": "Role not found"}), 400

    valid_password = bcrypt.check_password_hash(user.password, body["password"])
    if not valid_password:
        return jsonify({"msg": "Password not valid"}), 401
    token = create_access_token(identity=user.id, additional_claims={"role": user.role.name})

    return jsonify({"token": token}), 200

@api.route("/userinfo", methods=["GET"])
@jwt_required()
def user_info():
    user_id = get_jwt_identity()
    token_info = get_jwt()
    user=User.query.get(user_id)
    if user is None:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"userinfo": user.serialize(), "role": token_info["role"]}), 200

@api.route("/logout", methods=["POST"])
@jwt_required()
def user_logout():
    token_data=get_jwt()
    token_blocked=TokenBlockedList(jti=token_data["jti"])
    db.session.add(token_blocked)
    db.session.commit()
    return jsonify({"message": "you are logged out"}), 200