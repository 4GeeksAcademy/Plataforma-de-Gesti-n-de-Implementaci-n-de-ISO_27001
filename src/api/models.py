from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    full_name = db.Column(db.String(120), nullable=True)
    registered_on = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)

    
    # Relación con RoleUser (tabla intersección)
    user_roles = db.relationship('RoleUser', back_populates='user')

    # Relación con UserProjectRole (para roles en proyectos)
    project_roles = db.relationship('UserProjectRole', back_populates='user')


    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,

            "is_active": self.is_active,
            "roles": [role_user.role.serialize() for role_user in self.user_roles],
            "registered_on": self.registered_on
        }

class Role(db.Model):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(255))
    
    # Relación con RoleUser (tabla intersección)
    role_users = db.relationship('RoleUser', back_populates='role')


    def __repr__(self):
        return f'<Role {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
        }

class RoleUser(db.Model):
    """
    Tabla de intersección que representa la relación entre User y Role.
    Puede manejar roles globales o roles específicos.
    """
    __tablename__ = 'role_user'
    id = db.Column(db.Integer, primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    is_global = db.Column(db.Boolean, default=False)  # Indica si es un rol global

    # Relación con Role
    role = db.relationship('Role', back_populates='role_users')
    # Relación con User
    user = db.relationship('User', back_populates='user_roles')

    def __repr__(self):
        return f"<RoleUser role_id={self.role_id} user_id={self.user_id} is_global={self.is_global}>"

    def serialize(self):
        return {
            "role_id": self.role_id,
            "user_id": self.user_id,
            "is_global": self.is_global
        }


class Project(db.Model):
    __tablename__ = 'project'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=True)
    company_name = db.Column(db.String(100), nullable=False, default='Default Company')
    start_date = db.Column(db.Date, nullable=True)  # Fecha de inicio
    end_date = db.Column(db.DateTime, nullable=True)    # Fecha de fin
    status = db.Column(db.String(50), nullable=False, default='activo')  # Estado del proyecto
    
    # ID del Jefe de Proyecto
    project_leader_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Usuario jefe de proyecto
    project_leader = db.relationship('User', foreign_keys=[project_leader_id], backref='led_projects')
    # Relación con los roles de usuarios en el proyecto
    user_project_roles = db.relationship('UserProjectRole', back_populates='project')
    

    def __repr__(self):
        return f'<Project {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,

            "company_name": self.company_name,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "status": self.status,
            "project_leader": self.project_leader.full_name if self.project_leader else None
        }

class UserProjectRole(db.Model):
    __tablename__ = 'user_project_role'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'), nullable=False)

    user = db.relationship('User', back_populates='project_roles')
    project = db.relationship('Project', back_populates='user_project_roles')
    role = db.relationship('Role')

    def __repr__(self):
        return f'<UserProjectRole user_id={self.user_id} project_id={self.project_id} role_id={self.role_id}>'

    def serialize(self):
        return {
            "user_id": self.user_id,
            "project_id": self.project_id,
            "role_id": self.role_id,
        }

class Iso(db.Model):
    __tablename__ = 'isos'
    id = db.Column(db.Integer, primary_key=True)
    name_iso = db.Column(db.String(50), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    deleted_at = db.Column(db.DateTime, nullable=True) 
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    selections = db.relationship('IsoSelection', back_populates='iso')

class IsoSelection(db.Model):
    __tablename__ = 'iso_selections'
    id = db.Column(db.Integer, primary_key=True)
    iso_id = db.Column(db.Integer, db.ForeignKey('isos.id'), nullable=False)
    section_id = db.Column(db.Integer, db.ForeignKey('sections.id'), nullable=False)
    deleted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    iso = db.relationship('Iso', back_populates='selections')
    section = db.relationship('Section', back_populates='iso_selections')

class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    sub_section_id = db.Column(db.Integer, db.ForeignKey('sub_sections.id'), nullable=False)
    question = db.Column(db.String(150), nullable=False)
    order = db.Column(db.Integer, nullable=False)
    menu_id = db.Column(db.Integer, nullable=False)
    deleted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    sub_section = db.relationship('SubSection', back_populates='questions')

class SubSection(db.Model):
    __tablename__ = 'sub_sections'
    id = db.Column(db.Integer, primary_key=True)
    section_id = db.Column(db.Integer, db.ForeignKey('sections.id'), nullable=False)
    sub_section = db.Column(db.String(150), nullable=False)
    deleted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    section = db.relationship('Section', back_populates='sub_sections')
    questions = db.relationship('Question', back_populates='sub_section')

class Section(db.Model):
    __tablename__ = 'sections'
    id = db.Column(db.Integer, primary_key=True)
    section = db.Column(db.String(100), nullable=False)
    deleted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    sub_sections = db.relationship('SubSection', back_populates='section')
    iso_selections = db.relationship('IsoSelection', back_populates='section')
    item_sections = db.relationship('ItemSection', back_populates='section')  # Relación con ItemSection


class ItemSection(db.Model):
    __tablename__ = 'itemsections'
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    section_id = db.Column(db.Integer, db.ForeignKey('sections.id'), nullable=False)
    deleted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    item = db.relationship('Item', back_populates='item_sections')  # Corregido a 'item_sections'
    section = db.relationship('Section', back_populates='item_sections')


class Item(db.Model):
    __tablename__ = 'items'
    id = db.Column(db.Integer, primary_key=True)
    item = db.Column(db.String(50), nullable=False)
    deleted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    item_sections = db.relationship('ItemSection', back_populates='item')  # Corregido a 'item_sections'


class Answer(db.Model):
    __tablename__ = 'answers'
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    iso_id = db.Column(db.Integer, db.ForeignKey('isos.id'), nullable=False)
    sub_section_id = db.Column(db.Integer, db.ForeignKey('sub_sections.id'), nullable=False)
    response_menu = db.Column(db.Integer, nullable=False)
    recourse = db.Column(db.String(200), nullable=True)
    questions = db.Column(db.String(200), nullable=True)
    observations = db.Column(db.String(200), nullable=True)
    deleted_at = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relaciones
    question = db.relationship('Question')
    iso = db.relationship('Iso')
    sub_section = db.relationship('SubSection')

class TokenBlockedList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120), unique=True, nullable=False)
    type = db.Column(db.Enum("Access", "Password", name="token_type_enum"), nullable=False)

    def __init__(self, jti, type):
        self.jti = jti
        self.type = type