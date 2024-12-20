"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import requests
import datetime, cloudinary
import uuid
from flask import Flask, request, jsonify, url_for, json, Blueprint, redirect

from api.models import db, User, Role, Project, Iso, UserProjectRole, TokenBlockedList, ProjectContextResponse,  RoleUser, Answer, Meeting
from datetime import timedelta

from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity, decode_token
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
from tempfile import NamedTemporaryFile
from werkzeug.utils import secure_filename

from werkzeug.security import generate_password_hash
from datetime import timedelta


api = Blueprint('api', __name__)

# Configuración de CORS para el Blueprint
CORS(api, resources={r"/*": {"origins": "*"}})

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


ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif'}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


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
            return jsonify({"msg": "Se requiere un correo electrónico"}), 400
        user = User.query.filter_by(email=body['email']).first()
        if user is None:
            return jsonify({"msg": "El correo electrónico no está registrado"}), 404
        reset_token = create_access_token(identity=user.id, additional_claims={"Type": "Password"}, expires_delta=timedelta(minutes=15))
        # reset_url = f"https://literate-waffle-rrqp9gxq9wp259jx-3001.app.github.dev/api/reset-password/{reset_token}"
        reset_url = f"https://ideal-goldfish-w9pg6746rp7hxpx-3000.app.github.dev/change-password/?token={reset_token}"
        msg = Message("CerBro - Recuperación de contraseña", recipients=[user.email])
        msg.body = f"Hola {user.full_name},\n\nHaz clic en el siguiente enlace para restablecer tu contraseña:\n{reset_url}\n\nEste enlace expira en 15 minutos."
        mail.send(msg)
        return jsonify({"msg": "Correo de recuperación enviado"}), 200
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

@api.route('/changepassword', methods=['PATCH'])
@jwt_required()
def change_password():
    try:
        body = request.get_json()
        if 'current_password' not in body or 'new_password' not in body:
            return jsonify({"msg": "Se requiere la contraseña actual y la nueva contraseña"}), 400
        user_id = get_jwt_identity()
        
        user = User.query.get_or_404(user_id)

        if len(body['new_password']) < 6:
            return jsonify({"msg": "La nueva contraseña debe tener al menos 6 caracteres"}), 400
        
        hashed_password = bcrypt.generate_password_hash(body['new_password']).decode('utf-8')
        user.password = hashed_password
        db.session.commit()
        
        return jsonify({"msg": "Contraseña actualizada exitosamente"}), 200
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

@api.route("/project", methods=["POST"])
@jwt_required()
def project_create():
    try:
        body = request.get_json()
        required_fields = ["projectName", "companyName", "projectDescription", "startDate"]
        
        for field in required_fields:
            if field not in body or body[field] is None:
                return jsonify({"msg": f"Debe especificar un {field}"}), 400

        # Verificar si el proyecto ya existe
        project = Project.query.filter_by(name=body["projectName"]).first()
        if project is not None:
            return jsonify({"msg": "El proyecto ya existe"}), 400

        # Obtener el ID del usuario actual
        user_id = get_jwt_identity()

        # Crear el proyecto
        new_project = Project(
            name=body["projectName"],
            description=body.get("projectDescription", ""),
            company_name=body["companyName"],
            start_date=body["startDate"],
            project_leader_id=user_id
        )
        db.session.add(new_project)
        db.session.commit()

        # Asignar el rol de Líder de Proyecto
        project_leader_role = Role.query.filter_by(name='Líder de Proyecto').first()
        if not project_leader_role:
            project_leader_role = Role(name='Líder de Proyecto', description='Rol para líderes de proyecto')
            db.session.add(project_leader_role)
            db.session.commit()

        # Crear relación RoleUser
        role_user = RoleUser(user_id=user_id, role_id=project_leader_role.id, is_global=False)
        db.session.add(role_user)
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
    
    # Verificar si el usuario ya existe
    existing_user = User.query.filter_by(email=body["email"]).first()
    if existing_user:
        return jsonify({"msg": "El usuario ya existe"}), 400

    # Crear el nuevo usuario
    hashed_password = bcrypt.generate_password_hash(body["password"]).decode("utf-8")
    new_user = User(
        email=body["email"],
        password=hashed_password,
        full_name=body["full_name"],
        is_active=True,
    )
    db.session.add(new_user)
    db.session.commit()

    # Asignar roles
    if User.query.count() == 1:  # Primer usuario registrado
        admin_role = Role.query.filter_by(name='Administrador de Plataforma').first()
        if not admin_role:
            admin_role = Role(name='Administrador de Plataforma', description='Acceso completo a la plataforma')
            db.session.add(admin_role)
            db.session.commit()
        
        # Crear relación RoleUser
        role_user = RoleUser(user_id=new_user.id, role_id=admin_role.id, is_global=True)
        db.session.add(role_user)
        db.session.commit()
    else:  # Usuarios subsecuentes
        default_role = Role.query.filter_by(name='Usuario Básico').first()
        if not default_role:
            default_role = Role(name='Usuario Básico', description='Rol básico para nuevos usuarios')
            db.session.add(default_role)
            db.session.commit()
        
        # Crear relación RoleUser
        role_user = RoleUser(user_id=new_user.id, role_id=default_role.id, is_global=True)
        db.session.add(role_user)
        db.session.commit()

    return jsonify({
        "msg": "Usuario registrado exitosamente",
        "user": new_user.serialize()
    }), 200

   

@api.route("/login", methods=['POST'])
def user_login():
    body = request.get_json()

    if body.get("email") is None:
        return jsonify({"msg": "You must enter an email"}), 400
    if body.get("password") is None:
        return jsonify({"msg": "You must enter a password"}), 400

    user = User.query.filter_by(email=body["email"]).first()
    print (user)
    if user is None:
        return jsonify({"msg": "User not found"}), 400
    #if not user.role or not user.role.name:
       # return jsonify({"msg": "Role not found"}), 400

    valid_password = bcrypt.check_password_hash(user.password, body["password"])
    if not valid_password:
        return jsonify({"msg": "Password not valid"}), 401
    token = create_access_token(identity=str(user.id))# additional_claims={"role": user.role.name})


    return jsonify({"token": token,
                    "full_name": user.full_name}), 200

@api.route("/userinfo", methods=["GET"])
@jwt_required()
def user_info():
    user_id = get_jwt_identity()
    token_info = get_jwt()
    user=User.query.get(user_id)
    if user is None:
        return jsonify({"msg": "User not found"}), 404
    return jsonify({"userinfo": user.serialize(), "role": token_info["role"]}), 200

@api.route("/logout", methods=["POST"])
@jwt_required()
def user_logout():
    token_data=get_jwt()
    token_blocked=TokenBlockedList(jti=token_data["jti"])
    db.session.add(token_blocked)
    db.session.commit()
    return jsonify({"msg": "you are logged out"}), 200

@api.route("/manage/users", methods=["GET"])
def get_all_users():
    all_users = User.query.all()
    if not all_users:
        return jsonify({"error": "Users not found"}), 404
    all_users_serialize = []
    for user in all_users:
        all_users_serialize.append(user.serialize())
    return jsonify(all_users_serialize), 200

@api.route("/manage/projects", methods=["GET"])
def get_all_projects():
    all_projects = Project.query.all()  # Consulta todos los proyectos
    if not all_projects:
        return jsonify({"error": "Projects not found"}), 404  # Devuelve un error si no hay proyectos

    # Serializa los proyectos
    all_projects_serialize = [project.serialize() for project in all_projects]

    return jsonify(all_projects_serialize), 200  # Devuelve la lista serializada con un código HTTP 200


@api.route("/all/roles", methods=["GET"])
def get_all_roles():
    all_roles = Role.query.all()
    if not all_roles:
        return jsonify({"error": "Roles not found"}), 404
    all_roles_serialize = []
    for role in all_roles:
        all_roles_serialize.append(role.serialize())
    return jsonify(all_roles_serialize), 200

@api.route("/change/user/role", methods=["PATCH"])
def modify_user_role():
    body = request.get_json()

    # Buscar el usuario por email
    user = User.query.filter_by(email=body["email"]).first()
    if user is None:
        return jsonify({"msg": "User not found"}), 404

    # Si el rol es None, eliminar el rol actual del usuario
    if body.get("global_role") is None:
        user.global_role = None
        db.session.commit()
        return jsonify({"msg": "Rol de usuario eliminado", "user": user.serialize()}), 200

    # Buscar el rol por nombre
    role_to_assign = Role.query.filter_by(name=body["global_role"]).first()
    if not role_to_assign:
        return jsonify({"msg": "Role not found"}), 404

    # Restricción para no permitir el rol de "Administrador de Plataforma"
    if role_to_assign.name == "Administrador de Plataforma":
        return jsonify({"msg": "No se puede asignar el rol de Administrador de Plataforma"}), 403

    # Asignar el nuevo rol al usuario
    user.global_role = role_to_assign
    db.session.commit()

    return jsonify({"msg": "Rol de usuario modificado", "user": user.serialize()}), 200

@api.route("/projects", methods=["GET"])
@jwt_required()
def get_user_projects():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    user_projects = Project.query.filter(
        (Project.project_leader_id == user_id) |
        (Project.user_project_roles.any(UserProjectRole.user_id == user_id))
    ).all()
    
    return jsonify([project.serialize() for project in user_projects]), 200

@api.route("/projects/<int:project_id>", methods=["DELETE"])
@jwt_required()
def delete_project(project_id):
    try:
        # Obtener el usuario autenticado
        user_id = get_jwt_identity()

        # Verificar si el proyecto existe
        project = Project.query.get(project_id)
        if not project:
            return jsonify({"msg": "Proyecto no encontrado"}), 404

        # Verificar si el usuario tiene permisos para eliminar
        # O es el líder del proyecto
        is_leader = project.project_leader_id == user_id

        # O tiene el rol de Líder de Proyecto en este proyecto
        has_project_role = RoleUser.query.filter_by(
            user_id=user_id,
            role_id=Role.query.filter_by(name="Líder de Proyecto").first().id,
            is_global=False
        ).first()

        if not (is_leader or has_project_role):
            return jsonify({"msg": "No tienes permisos para eliminar este proyecto"}), 403

        # Si tiene permisos, eliminar el proyecto
        db.session.delete(project)
        db.session.commit()

        return jsonify({"msg": "Proyecto eliminado exitosamente"}), 200

    except Exception as e:
        return jsonify({"msg": str(e)}), 500



@api.route("/projects/<int:project_id>", methods=["GET"])
@jwt_required()
def get_project(project_id):
    user_id = get_jwt_identity()
    project = Project.query.get(project_id)
    
    if not project:
        return jsonify({"msg": "Proyecto no encontrado"}), 404
    
    # Verificar si el usuario es parte del proyecto o es el líder del proyecto
    is_user_in_project = (
        project.project_leader_id == user_id or 
        any(role.user_id == user_id for role in project.user_project_roles)
    )
    
    if not is_user_in_project:
        return jsonify({"msg": "No tienes acceso a este proyecto"}), 403
    
    return jsonify(project.serialize()), 200

@api.route("/profilepic", methods=["PUT"])
@jwt_required()
def user_picture():
    try:
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"msg": "User not found"}), 404

        # Verificar si se recibió el archivo
        if "profilePic" not in request.files:
            return jsonify({"msg": "No file part in request"}), 400

        file = request.files["profilePic"]
        if file.filename == "":
            return jsonify({"msg": "No selected file"}), 400

        # Validar la extensión del archivo
        extension = file.filename.split(".")[-1]
        if extension not in ['jpg', 'jpeg', 'png', 'gif']:  # Puedes ajustar las extensiones válidas
            return jsonify({"msg": "Invalid file type. Allowed types: jpg, jpeg, png, gif."}), 400

        # Guardar el archivo temporalmente
        temp = NamedTemporaryFile(delete=False)
        file.save(temp.name)

        # Subir a Cloudinary
        filename = f"usersPictures/{user_id}.{extension}"
        try:
            upload_result = cloudinary.uploader.upload(temp.name, public_id=filename, folder="userPictures")
            print("Upload Result:", upload_result)  # Ver el resultado del upload

            # Guardar la URL del perfil
            user.profile_pic = upload_result["public_id"]
            db.session.add(user)
            db.session.commit()

        finally:
             os.unlink(temp.name)  # Asegurarse de borrar el archivo temporal

        return jsonify({"msg": "Picture updated"})
    except Exception as ex:
        print("Error al subir la foto:", ex)  # Mostrar la excepción
        return jsonify({"msg": "Error al subir la foto de perfil"}), 500


    
@api.route("/profilepic/get", methods=["GET"])
@jwt_required()
def user_profile_picture_get():
    user_id=get_jwt_identity()
    user=User.query.get(user_id)
    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    print(user.profile_pic)
    image_info=cloudinary.api.resource(user.profile_pic)
    print(image_info)

    return jsonify({"url": image_info["secure_url"]})

@api.route("/answers/<int:answer_id>/uploadfiles", methods=["PUT"])
@jwt_required()
def upload_answer_files(answer_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"msg": "User not found"}), 404

        answer = Answer.query.filter_by(id=answer_id).first()
        if not answer:
            return jsonify({"msg": "Answer not found"}), 404

        if "files" not in request.files:
            return jsonify({"msg": "No file in request"}), 400

        files = request.files.getlist("files")
        if not files:
            return jsonify({"msg": "No selected files"}), 400

        file_urls = [] 

        for file in files:
            if file.filename == "":
                return jsonify({"msg": "One or more files have no name"}), 400

            if not allowed_file(file.filename):
                return jsonify({"msg": "Invalid file type. Allowed types: pdf, doc, docx, txt, jpg, jpeg, png, gif."}), 400

            temp = NamedTemporaryFile(delete=False)
            file.save(temp.name)

            filename = f"answerFiles/{answer_id}_{uuid.uuid4()}"
            upload_result = cloudinary.uploader.upload(temp.name, public_id=filename, folder="answerFiles", resource_type="auto", access_mode="public")
            file_urls.append(upload_result["secure_url"]) 

        if file_urls:
            answer.project_file = file_urls[0]  
            db.session.commit()

        return jsonify({"msg": "Files uploaded successfully", "file_urls": file_urls})

    except Exception as ex:
        print("Error al subir los archivos:", ex)
        return jsonify({"msg": "Error al subir los archivos"}), 500

    try:
        user_id = get_jwt_identity()
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"msg": "User not found"}), 404

        if "files" not in request.files:
            return jsonify({"msg": "No file in request"}), 400

        files = request.files.getlist("files")
        if not files:
            return jsonify({"msg": "No selected files"}), 400

        answer_id = request.form.get("answer_id")  # Ahora usamos 'answer_id'
        if not answer_id:
            return jsonify({"msg": "Answer ID is required"}), 400

        answer = Answer.query.filter_by(id=answer_id).first()  # Buscar la respuesta en lugar del proyecto
        if not answer:
            return jsonify({"msg": "Answer not found"}), 404

        file_urls = [] 

        for file in files:
            if file.filename == "":
                return jsonify({"msg": "One or more files have no name"}), 400

            if not allowed_file(file.filename):
                return jsonify({"msg": "Invalid file type. Allowed types: pdf, doc, docx, txt, jpg, jpeg, png, gif."}), 400

            temp = NamedTemporaryFile(delete=False)
            file.save(temp.name)

            # Subir a Cloudinary con un nombre único
            filename = f"userFiles/{user_id}_{uuid.uuid4()}"

            upload_result = cloudinary.uploader.upload(temp.name, public_id=filename, folder="userFiles", resource_type="auto", access_mode="public")
            file_urls.append(upload_result["secure_url"])  # Guardar la URL del archivo

        if file_urls:
            answer.project_file = file_urls[0]  # Ahora asociamos la URL con 'project_file' en la tabla Answer
            db.session.commit()

        return jsonify({"msg": "Files uploaded successfully", "file_urls": file_urls})

    except Exception as ex:
        print("Error al subir los archivos:", ex)
        return jsonify({"msg": "Error al subir los archivos"}), 500


# @api.route("/uploadfiles", methods=["PUT"])
# @jwt_required()
# def upload_files():
#     try:
#         user_id = get_jwt_identity()
#         user = User.query.filter_by(id=user_id).first()
#         if not user:
#             return jsonify({"msg": "User not found"}), 404

#         if "files" not in request.files:
#             return jsonify({"msg": "No file in request"}), 400

#         files = request.files.getlist("files")
#         if not files:
#             return jsonify({"msg": "No selected files"}), 400

#         project_id = request.form.get("project_id")
#         if not project_id:
#             return jsonify({"msg": "Project ID is required"}), 400

#         project = Project.query.filter_by(id=project_id).first()
#         if not project:
#             return jsonify({"msg": "Project not found"}), 404

#         file_urls = [] 

#         for file in files:
#             if file.filename == "":
#                 return jsonify({"msg": "One or more files have no name"}), 400

#             if not allowed_file(file.filename):
#                 return jsonify({"msg": "Invalid file type. Allowed types: pdf, doc, docx, txt, jpg, jpeg, png, gif."}), 400

#             temp = NamedTemporaryFile(delete=False)
#             file.save(temp.name)

#             # Subir a Cloudinary con un nombre único
#             filename = f"userFiles/{user_id}_{uuid.uuid4()}"

#             upload_result = cloudinary.uploader.upload(temp.name, public_id=filename, folder="userFiles", resource_type="auto", access_mode="public")
#             file_urls.append(upload_result["secure_url"])  # Guardar la URL del archivo

#         if file_urls:
#             project.project_file = file_urls[0]  # Guardar solo la primera URL
#             db.session.commit()

#         return jsonify({"msg": "Files uploaded successfully", "file_urls": file_urls})

#     except Exception as ex:
#         print("Error al subir los archivos:", ex)
#         return jsonify({"msg": "Error al subir los archivos"}), 500

@api.route("/projects/<int:project_id>/files", methods=["GET"])
@jwt_required()
def get_project_files(project_id):
    try:
        # Obtener el proyecto por ID
        project = Project.query.get(project_id)
        if not project:
            return jsonify({"msg": "Project not found"}), 404

        if not project.project_file:
            return jsonify({"msg": "No files associated with this project"}), 404

        # Retornar las URLs de los archivos
        return jsonify({"files": [project.project_file]}), 200

    except Exception as ex:
        print("Error al obtener los archivos del proyecto:", ex)
        return jsonify({"msg": "Error al obtener los archivos del proyecto"}), 500

@api.route('/testing/<int:isoID>', methods=['GET'])
def get_basic_info_by_id(isoID):
    iso = Iso.query.get(isoID)
    if not iso:
        return jsonify({"msg": "Iso no encontrado"}),404
    iso_data = iso.serialize()
    subDomains = Iso.query.filter_by(father=str(iso.id)).all()
    if subDomains:
        subDomains_data = [domain.serialize() for domain in subDomains]
         
        iso_data["subDomains"] = subDomains_data
    
    return jsonify({"info":iso_data}),200

@api.route('/testing', methods=['GET'])
def get_basic_inf():
    isos = Iso.query.all()
    if not isos:
        return jsonify({"msg": "Iso no encontrado"}),404
    iso_data = [iso.serialize() for iso in isos]
    
    return jsonify(iso_data),200

@api.route('/contexts', methods=['POST'])
def create_context():
    try:
        data = request.get_json() 
        
        for contexto_data in data:
            print(data)
            iso = Iso(
                id=contexto_data['id'],
                father=contexto_data['father'],
                iso=contexto_data['iso'],
                version=contexto_data['version'],
                level=contexto_data['level'],
                title=contexto_data['title'],
                description=contexto_data['description']
            )
            db.session.add(iso)
        db.session.commit()
        
        return jsonify({"message": "Contextos guardados correctamente"}), 201
    except Exception as e:
        print (e)
        return jsonify({"error": str(e)}), 500
    
@api.route('/project/<int:project_id>/responses', methods=['GET'])
@jwt_required()
def get_project_responses(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"msg": "Proyecto no encontrado"}), 404

    responses = ProjectContextResponse.query.filter_by(project_id=project_id).all()
    return jsonify([response.serialize() for response in responses]), 200


@api.route('/project/<int:project_id>/response', methods=['POST'])
@jwt_required()
def save_project_response(project_id):
    try:
        data = request.get_json()
        print("Datos recibidos:", data) 
        data = request.get_json()
        subdomain_id = data.get('subdomain_id')
        response = data.get('response')
        comment = data.get('comment')

        if not subdomain_id or not response:
            return jsonify({"msg": "Faltan datos necesarios"}), 400
        if not isinstance(project_id, int):
            return jsonify({"msg": "Invalid project ID"}), 400
        
        # Verificar que el proyecto y el subdominio existan
        project = Project.query.get(project_id)
        subdomain = Iso.query.get(subdomain_id)

        if not project or not subdomain:
            return jsonify({"msg": "Proyecto o subdominio no encontrado"}), 404

        # Buscar si ya existe una respuesta para ese proyecto y subdominio
        existing_response = ProjectContextResponse.query.filter_by(
            project_id=project_id,
            subdomain_id=subdomain_id
        ).first()

        if existing_response:
            # Actualizar respuesta existente
            existing_response.response = response
            existing_response.comment = comment
        else:
            # Crear nueva respuesta
            new_response = ProjectContextResponse(
                project_id=project_id,
                subdomain_id=subdomain_id,
                response=response,
                comment=comment
            )
            db.session.add(new_response)

        db.session.commit()
        return jsonify({"msg": "Respuesta guardada correctamente"}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({"msg": str(e)}), 500


@api.route("/projects/<int:project_id>/roles", methods=["GET", "POST", "PATCH", "DELETE"])
@jwt_required()
def manage_project_roles(project_id):
    user_id = int(get_jwt_identity())
    project = Project.query.get(project_id)

    # Verificar que el proyecto exista
    if not project:
        return jsonify({"msg": "Proyecto no encontrado"}), 404

    # Verificar que el usuario sea el líder del proyecto
    if project.project_leader_id != user_id:
        print(f"project_leader_id: {project.project_leader_id}, user_id: {user_id}")
        print(type(project.project_leader_id), type(user_id))
        return jsonify({"msg": "No tienes permisos para gestionar los roles de este proyecto"}), 403

    if request.method == "GET":
        # Listar los usuarios con roles en el proyecto
        roles = UserProjectRole.query.filter_by(project_id=project_id).all()
        return jsonify([{
            "user": role.user.serialize(),
            "role": role.role.serialize()
        } for role in roles]), 200

    if request.method == "POST":
        # Agregar un usuario al proyecto con un rol
        body = request.get_json()
        email = body.get("email")
        role_name = body.get("role")

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        role = Role.query.filter_by(name=role_name).first()
        if not role:
            return jsonify({"msg": "Rol no encontrado"}), 404

        existing_role = UserProjectRole.query.filter_by(user_id=user.id, project_id=project_id).first()
        if existing_role:
            return jsonify({"msg": "El usuario ya forma parte del proyecto"}), 400

        new_role = UserProjectRole(user_id=user.id, project_id=project_id, role_id=role.id)
        db.session.add(new_role)
        db.session.commit()

        return jsonify({"msg": "Usuario agregado al proyecto", "user": user.serialize()}), 201

    if request.method == "PATCH":
        # Modificar el rol de un usuario en el proyecto
        body = request.get_json()
        user_id = body.get("user_id")
        new_role_name = body.get("role")

        role = Role.query.filter_by(name=new_role_name).first()
        if not role:
            return jsonify({"msg": "Rol no encontrado"}), 404

        user_project_role = UserProjectRole.query.filter_by(user_id=user_id, project_id=project_id).first()
        if not user_project_role:
            return jsonify({"msg": "Usuario no pertenece a este proyecto"}), 404

        user_project_role.role_id = role.id
        db.session.commit()

        return jsonify({"msg": "Rol del usuario actualizado"}), 200

    if request.method == "DELETE":
        # Eliminar un usuario del proyecto
        body = request.get_json()
        user_id = body.get("user_id")

        user_project_role = UserProjectRole.query.filter_by(user_id=user_id, project_id=project_id).first()
        if not user_project_role:
            return jsonify({"msg": "Usuario no pertenece a este proyecto"}), 404

        db.session.delete(user_project_role)
        db.session.commit()

        return jsonify({"msg": "Usuario eliminado del proyecto"}), 200

@api.route('/projects/<int:project_id>/add-user', methods=['POST'])
@jwt_required()
def add_user_to_project(project_id):
    try:
        # Obtener el usuario autenticado
        current_user_id = int(get_jwt_identity())
        current_user = User.query.get(current_user_id)

        # Verificar que el proyecto existe
        project = Project.query.get_or_404(project_id)

        # Validar que el usuario autenticado es líder del proyecto
        if project.project_leader_id != current_user_id:
            print(f"current_user_id: {current_user_id}, project_leader_id: {project.project_leader_id}")
            print(type(project.project_leader_id), type(current_user_id))
            return jsonify({"msg": "No tienes permisos para agregar usuarios a este proyecto"}), 403

        # Obtener datos del cuerpo de la solicitud
        data = request.get_json()
        user_id = data.get("user_id")
        role_id = data.get("role_id")

        # Validar que los campos necesarios están presentes
        if not user_id or not role_id:
            return jsonify({"msg": "Faltan campos requeridos (user_id, role_id)"}), 400

        # Convertir a enteros y verificar que los valores son válidos
        try:
            user_id = int(user_id)
            role_id = int(role_id)
        except ValueError:
            return jsonify({"msg": "user_id y role_id deben ser enteros"}), 400

        # Verificar que el usuario y el rol existen
        user = User.query.get_or_404(user_id)
        role = Role.query.get_or_404(role_id)

        # Verificar que el usuario no está ya asignado al proyecto con el mismo rol
        existing_role = UserProjectRole.query.filter_by(
            user_id=user_id,
            project_id=project_id,
            role_id=role_id
        ).first()

        if existing_role:
            return jsonify({"msg": "El usuario ya tiene este rol en el proyecto"}), 400

        # Crear la relación en la tabla UserProjectRole
        user_project_role = UserProjectRole(
            user_id=user_id,
            project_id=project_id,
            role_id=role_id
        )
        db.session.add(user_project_role)
        db.session.commit()

        # Devolver los datos del usuario agregado
        return jsonify({
            "msg": "Usuario agregado al proyecto con éxito",
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "role": role.name
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"msg": "Error interno del servidor", "error": str(e)}), 500

@api.route("/zoom/authorize", methods=["GET"])
def zoom_authorize():
    zoom_authorize_url = os.getenv("ZOOM_AUTHORIZE_URL")
    client_id = os.getenv("ZOOM_CLIENT_ID")
    redirect_uri = os.getenv("ZOOM_REDIRECT_URI")

    # Construir la URL de autorización
    auth_url = f"{zoom_authorize_url}?response_type=code&client_id={client_id}&redirect_uri={redirect_uri}"
    return jsonify({"authorization_url": auth_url}), 200

@api.route("/zoom/callback", methods=["GET"])
def zoom_callback():
    try:
        # Obtener el código de autorización
        code = request.args.get("code")
        if not code:
            return jsonify({"msg": "Authorization code not found"}), 400

        # Variables necesarias
        token_url = os.getenv("ZOOM_AUTH_URL")
        client_id = os.getenv("ZOOM_CLIENT_ID")
        client_secret = os.getenv("ZOOM_CLIENT_SECRET")
        redirect_uri = os.getenv("ZOOM_REDIRECT_URI")

        # Crear el payload para obtener el token
        payload = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": redirect_uri,
        }

        # Crear los headers con autenticación básica
        headers = {
            "Authorization": f"{requests.auth._basic_auth_str(client_id, client_secret)}",
            "Content-Type": "application/x-www-form-urlencoded",
        }
        print(f"Payload: {payload}")
        print(f"Headers: {headers}")
        print(f"Token URL: {token_url}")

        # Realizar la solicitud al endpoint de Zoom
        response = requests.post(token_url, data=payload, headers=headers)

        # Si hay un error en la respuesta
        if response.status_code != 200:
            return jsonify({
                "msg": "Failed to fetch access token",
                "error": response.json()
            }), response.status_code

        # Procesar los tokens recibidos
        tokens = response.json()
        access_token = tokens.get("access_token")
        refresh_token = tokens.get("refresh_token")
        expires_in = tokens.get("expires_in")

        
        # Redirigir a la aplicación con el token
        frontend_url = os.getenv("FRONTEND_URL", "https://fantastic-happiness-4xq5xr7jg7x25797-3000.app.github.dev/")
        return redirect(f"{frontend_url}/zoom-authorized?access_token={access_token}")
    except Exception as e:
        return jsonify({"msg": "Internal Server Error", "error": str(e)}), 500


@api.route("/zoom/create-meeting", methods=["POST"])
def create_zoom_meeting():
    body = request.get_json()
    required_fields = ["topic", "start_time", "duration", "timezone"]
    for field in required_fields:
        if field not in body:
            return jsonify({"msg": f"Missing field: {field}"}), 400

    # Token (deberías manejarlo con una solución más segura)
    access_token = body.get("access_token")  # O bien recuperarlo de un almacenamiento seguro

    zoom_api_base_url = os.getenv("ZOOM_API_BASE_URL")
    meeting_url = f"{zoom_api_base_url}/users/me/meetings"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    payload = {
        "topic": body["topic"],
        "type": 2,  # Tipo de reunión programada
        "start_time": body["start_time"],  # ISO 8601
        "duration": body["duration"],  # Duración en minutos
        "timezone": body["timezone"],
        "settings": {
            "host_video": True,
            "participant_video": True,
        },
    }

    response = requests.post(meeting_url, json=payload, headers=headers)
    if response.status_code != 201:
        return jsonify({"msg": "Failed to create meeting", "error": response.json()}), response.status_code

    return jsonify(response.json()), 201


@api.route("/zoom/refresh-token", methods=["POST"])
def zoom_refresh_token():
    body = request.get_json()
    refresh_token = body.get("refresh_token")

    if not refresh_token:
        return jsonify({"msg": "Refresh token is required"}), 400

    token_url = os.getenv("ZOOM_AUTH_URL")
    client_id = os.getenv("ZOOM_CLIENT_ID")
    client_secret = os.getenv("ZOOM_CLIENT_SECRET")

    payload = {
        "grant_type": "refresh_token",
        "refresh_token": refresh_token,
    }

    headers = {
        "Authorization": f"{requests.auth._basic_auth_str(client_id, client_secret)}",
        "Content-Type": "application/x-www-form-urlencoded",
    }

    response = requests.post(token_url, data=payload, headers=headers)
    if response.status_code != 200:
        return jsonify({"msg": "Failed to refresh token", "error": response.json()}), response.status_code

    tokens = response.json()
    return jsonify({"access_token": tokens.get("access_token"), "refresh_token": tokens.get("refresh_token")}), 200

@api.route('/projects/<int:project_id>/meetings', methods=['GET'])
@jwt_required()
def get_project_meetings(project_id):
    project = Project.query.get_or_404(project_id)
    meetings = project.meetings  # Asumiendo que tienes una relación definida en el modelo
    return jsonify([meeting.serialize() for meeting in meetings]), 200

@api.route('/projects/<int:project_id>/meetings', methods=['POST'])
@jwt_required()
def create_project_meeting(project_id):
    try:
        user_id = int(get_jwt_identity())
        project = Project.query.get_or_404(project_id)

        # Verificar que el usuario tiene acceso al proyecto
        if user_id != project.project_leader_id:
            print(type(project.project_leader_id), type(user_id))
            return jsonify({"msg": "No tienes permisos para crear reuniones en este proyecto"}), 403

        body = request.get_json()
        required_fields = ["topic", "start_time", "duration"]
        for field in required_fields:
            if field not in body:
                return jsonify({"msg": f"Falta el campo: {field}"}), 400

        # Crear reunión (usa el modelo que corresponda)
        new_meeting = Meeting(
            project_id=project_id,
            user_id=user_id,
            topic=body["topic"],
            start_time=body["start_time"],
            duration=body["duration"],
            join_url=body.get("join_url", ""),
            password=body.get("password", "")
        )
        db.session.add(new_meeting)
        db.session.commit()

        return jsonify({"msg": "Reunión creada exitosamente", "meeting": new_meeting.serialize()}), 201
    except Exception as e:
        return jsonify({"msg": str(e)}), 500

@api.route("/user/zoom-access-token", methods=["GET"])
@jwt_required()
def get_zoom_access_token():
    user_id = get_jwt_identity()  # Obtiene el ID del usuario autenticado
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "Usuario no encontrado"}), 404

    if not user.zoom_access_token:
        return jsonify({"msg": "Zoom access token no encontrado"}), 404

    return jsonify({"zoom_access_token": user.zoom_access_token}), 200




# Registro del Blueprint en la aplicación Flask
app.register_blueprint(api, url_prefix="/api")