"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint

from api.models import db, User, Role, Project, UserProjectRole, TokenBlockedList
=======
from datetime import timedelta

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


@api.route("/user", methods=["PATCH"])
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
