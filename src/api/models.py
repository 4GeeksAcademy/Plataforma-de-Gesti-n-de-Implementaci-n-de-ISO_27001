from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Tabla intermedia para la relación muchos a muchos entre User y Role
user_roles = db.Table(
    'user_roles',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('role_id', db.Integer, db.ForeignKey('role.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    roles = db.relationship('Role', secondary=user_roles, back_populates='users')


class Role(db.Model):
    __tablename__ = 'role'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(255))
    users = db.relationship('User', secondary=user_roles, back_populates='roles')

class TokenBlockedList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120), unique=True, nullable=False)