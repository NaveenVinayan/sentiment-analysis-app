from functools import wraps
from flask import request, jsonify
import jwt, os
from models import User

def verify_user(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        
        if request.method == "OPTIONS":
            return '', 200

        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({
                "success": False,
                "error": "Token Not Provided"
            }), 401

        try:
            token = auth_header.split(" ")[1]

            decoded = jwt.decode(
                token,
                os.getenv("SECRET_KEY"),
                algorithms=["HS256"]
            )

            user = User.query.filter_by(id=decoded["_id"]).first()
            if not user:
                return jsonify({
                    "success": False,
                    "error": "User not found"
                }), 404

            request.user = user

        except jwt.ExpiredSignatureError:
            return jsonify({
                "success": False,
                "error": "Token Expired"
            }), 401

        except jwt.InvalidTokenError:
            return jsonify({
                "success": False,
                "error": "Invalid Token"
            }), 401

        except Exception as e:
            return jsonify({
                "success": False,
                "error": "Server error",
                "details": str(e)
            }), 500

        return f(*args, **kwargs)

    return decorated_function
