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
    
    # Rol global (opcional): solo se asignará para los administradores de plataforma
    global_role_id = db.Column(db.Integer, db.ForeignKey('role.id'))  # Administrador de plataforma
    global_role = db.relationship('Role', foreign_keys=[global_role_id])
    
    # Relación con roles de proyectos específicos
    project_roles = db.relationship('UserProjectRole', back_populates='user')

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "is_active": self.is_active,
            "global_role": self.global_role.name if self.global_role else None
        }


class Role(db.Model):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(255))
    
    # Relación para roles globales (como Administrador de Plataforma)
    users_with_global_role = db.relationship('User', foreign_keys='User.global_role_id')
    # Relación con roles de proyectos específicos
    project_roles = db.relationship('UserProjectRole', back_populates='role')

    def __repr__(self):
        return f'<Role {self.name}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
        }

class Project(db.Model):
    __tablename__ = 'project'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(255), nullable=True)
    company_name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.DateTime, nullable=True)  # Fecha de inicio
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
    role = db.relationship('Role', back_populates='project_roles')

    def __repr__(self):
        return f'<UserProjectRole user_id={self.user_id} project_id={self.project_id} role_id={self.role_id}>'

    def serialize(self):
        return {
            "user_id": self.user_id,
            "project_id": self.project_id,
            "role": self.role.name
        }

class TokenBlockedList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120), unique=True, nullable=False)