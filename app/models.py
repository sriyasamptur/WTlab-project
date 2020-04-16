from app import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))

    def __repr__(self):
        return '<User {}>'.format(self.username)
      
    def set_password(self, password):
        self.password_hash = password

    def get_username(self):
        return self.username

    def get_email(self):
        return self.email

    def get_password(self):
        return self.password_hash

    @login.user_loader
    def load_user(id):
        return User.query.get(int(id))

class MovieRating(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    username = db.Column(db.String(64))
    rating = db.Column(db.Integer)

db.create_all()