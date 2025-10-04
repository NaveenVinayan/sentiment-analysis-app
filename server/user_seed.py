
from flask import Flask
from flask_bcrypt import Bcrypt
from models import db, User, UserRole 
from dotenv import load_dotenv
import os

load_dotenv()


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

bcrypt = Bcrypt(app)
db.init_app(app)

def create_user(name, email, password, role):
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        print(f"User with email {email} already exists")
        return

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    new_user = User(
        name=name,
        email=email,
        password=hashed_password,
        role=role
    )

    db.session.add(new_user)
    db.session.commit()

    print(f"Created user: {name} ({role.value})")

def seed_users():
    with app.app_context():
        create_user("Admin", "admin", "admin123", UserRole.ADMIN)
        create_user("User", "user@gmail.com", "user", UserRole.USER)

if __name__ == "__main__":
    seed_users()
