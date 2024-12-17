  
import os
from flask_admin import Admin
from .models import db, User, Role, Project, TokenBlockedList, Iso, Question, Answer
from flask_admin.contrib.sqla import ModelView

class CustomView(ModelView):
    column_display_pk = True 
    column_default_sort = 'id'  

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')
 
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    
    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))

    admin.add_view(CustomView(Role, db.session))
    admin.add_view(CustomView(Project, db.session))
    admin.add_view(CustomView(Iso, db.session))
    admin.add_view(CustomView(Question, db.session))
    admin.add_view(CustomView(Answer, db.session))
    admin.add_view(CustomView(TokenBlockedList, db.session))
