from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from enum import Enum
from datetime import datetime

db = SQLAlchemy()

def get_uuid():
    return uuid4().hex

class UserRole(Enum):
    ADMIN = "admin"
    USER = "user"

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.String(11), primary_key=True , unique=True , default=get_uuid)
    name = db.Column(db.String(150))
    email = db.Column(db.String(150), unique=True)
    password = db.Column(db.Text, nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.USER) 
    
class Feedback(db.Model):
    __tablename__ = "feedbacks"
    id = db.Column(db.String(11), primary_key=True, unique=True, default=get_uuid)
    user_id = db.Column(db.String(11), db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comments = db.Column(db.Text, nullable=False)
    suggestions = db.Column(db.Text, nullable=True)
    predicted_emotion = db.Column(db.String(50), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
