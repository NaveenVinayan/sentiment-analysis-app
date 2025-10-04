from flask import Blueprint, request, jsonify
from models import User, Feedback,UserRole, db
from flask_bcrypt import Bcrypt
from middleware.authmiddleware import verify_user
import jwt, os
import joblib
from datetime import datetime, timedelta


MODEL_PATH = os.path.join(os.path.dirname(__file__), "../ml/sentiment_model.pkl")

sentiment_model = joblib.load(MODEL_PATH)

bcrypt = Bcrypt()

auth = Blueprint("auth", __name__, url_prefix="/api/auth")

def generate_jwt(user):
    payload = {
        "_id": str(user.id),
        "role": user.role.value,
        "exp": datetime.utcnow() + timedelta(days=10)
    }
    return jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")

@auth.route('/register', methods=["POST" , "OPTIONS"] )
def register():
    if request.method == "OPTIONS":
        return '', 200
    
    name = request.json["name"]
    email = request.json["email"] 
    password = request.json["password"]

    user_exists = User.query.filter_by(email=email).first() is not None

    if user_exists:
        return jsonify({"error": "Email already exists"}), 409
    
    hashed_password = bcrypt.generate_password_hash(password)
   
    new_user = User(name=name, email=email, password=hashed_password,  role=UserRole.USER)
    db.session.add(new_user)
    db.session.commit()
    
    token = generate_jwt(new_user)

    return jsonify({
        "success": True,
        "token": token,
        "user": {
            "_id": str(new_user.id),
            "name": new_user.name,
            "role": new_user.role.value
        }
    })
    
    
@auth.route("/login", methods=["POST" , "OPTIONS"])
def login_user():
    if request.method == "OPTIONS":
        return '', 200
    
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    user = User.query.filter_by(email=email).first()
    
    if user is None:
        return jsonify({ "error": "Unauthorized Access"}), 401
    
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Unauthorized"}),401
    
    token = generate_jwt(user)
    
    return jsonify({
        "success": True,
        "token": token,
        "user": {
            "_id": str(user.id),
            "name": user.name,
            "role": user.role.value
        }
    })


@auth.route("/verify", methods=["GET" , "OPTIONS"  ])
@verify_user
def verify():
    user = request.user  
    return jsonify({
        "success": True,
        "message": "User verified successfully",
        "user": {
            "_id": str(user.id),
            "name": user.name,
            "email": user.email,
            "role": user.role.value
        }
    })
    
@auth.route("/feedback", methods=["POST", "OPTIONS"])
@verify_user
def feedback():
    if request.method == "OPTIONS":
        return '', 200
    
    user = request.user 
    data = request.get_json()
    
    try:
        rating = data.get("rating")
        comments = data.get("comments")
        suggestions = data.get("suggestions")
        
        if not rating or not comments:
            return jsonify({
                "success": False,
                "error": "Rating and comments are required."
            }), 400
            
        predicted_emotion = sentiment_model.predict([comments])[0]

        new_feedback = Feedback(
            user_id=user.id,
            name=user.name, 
            rating=rating,
            comments=comments,
            suggestions=suggestions,
            predicted_emotion=predicted_emotion
        )
        
        db.session.add(new_feedback)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Feedback submitted successfully",
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "error": "Server error",
            "details": str(e)
        }), 500
 
 
@auth.route("/feedbacks", methods=["GET", "OPTIONS"])
@verify_user
def get_feedbacks():
    
    if request.method == "OPTIONS":
        return '', 200
    
    feedbacks = Feedback.query.order_by(Feedback.timestamp.desc()).all()
    data = [
        {
            "id": f.id,
            "user_id": f.user_id,
            "name":f.name,
            "rating": f.rating,
            "comments": f.comments,
            "suggestions": f.suggestions,
            "predicted_emotion": f.predicted_emotion,
            "timestamp": f.timestamp.isoformat()
        }
        for f in feedbacks
    ]
    
    return jsonify({
        "feedbacks": data,
        "success": True,
        "message": "Feedback retrieved successfully",
        })