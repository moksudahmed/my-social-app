from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from bson import ObjectId
from flask_cors import CORS
from bson import json_util
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'

# Set up MongoDB connection
try:
    client = MongoClient('mongodb+srv://kmrahman11:sylhet3100@cluster0.qwcawco.mongodb.net/?retryWrites=true&w=majority')
    db = client['your_database_name']
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

jwt = JWTManager(app)


@app.route('/register', methods=['POST'])
def register():
 
    try:
     
        data = request.get_json()
       
        existing_user = db.users.find_one({'username': data['username']})
        print(data)
        if existing_user:
            return jsonify({'message': 'Username already exists'}), 400

        new_user = {
            'username': data['username'],
            'password': data['password'],
            'email': data['email'],
            'firstname': data['firstname'],
            'lastname': data['lastname']            
        }
        print(new_user)
        user_id = db.users.insert_one(new_user).inserted_id
        return jsonify({'message': 'User registered successfully', 'user_id': str(user_id)}), 201

    except Exception as e:
        return jsonify({'message': f'Error during registration: {e}'}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = db.users.find_one({'username': data['username'], 'password': data['password']})
        
        if user:
            access_token = create_access_token(identity=str(user['_id']))            
            return jsonify(access_token=access_token), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'message': f'Error during login: {e}'}), 500

@app.route('/post', methods=['POST'])
@jwt_required()
def post():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        new_post = {
            'user_id': ObjectId(current_user),
            'content_type': 'text', # 'photo', or 'video'
            'content': data['content'],
            'likes': [],
            'comments': [],
            'shares': []
        }
        print(data['content'])
        print(new_post)
        post_id = db.posts.insert_one(new_post).inserted_id
        return jsonify({'message': 'Post created successfully', 'post_id': str(post_id)}), 201

    except Exception as e:
        return jsonify({'message': f'Error during post creation: {e}'}), 500

@app.route('/posts', methods=['GET'])
@jwt_required()
def get_all_posts():
    try:
        current_user = get_jwt_identity()
        # Assuming you have a 'posts' collection in your MongoDB
        posts = list(db.posts.find())

        # Use json_util to serialize ObjectId
        serialized_posts = json.loads(json_util.dumps(posts))

        return jsonify(serialized_posts), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/like/<string:post_id>', methods=['POST'])
@jwt_required()
def like_post(post_id):
    try:
        current_user = get_jwt_identity()
        post = db.posts.find_one({'_id': ObjectId(post_id)})

        if post:
            if current_user not in post['likes']:
                db.posts.update_one({'_id': ObjectId(post_id)}, {'$push': {'likes': current_user}})
                return jsonify({'message': 'Post liked successfully'}), 200
            else:
                return jsonify({'message': 'You have already liked this post'}), 400
        else:
            return jsonify({'message': 'Post not found'}), 404

    except Exception as e:
        return jsonify({'message': f'Error during liking post: {e}'}), 500

@app.route('/comment/<string:post_id>', methods=['POST'])
@jwt_required()
def comment_post(post_id):
    try:
        current_user = get_jwt_identity()
        data = request.get_json()

        new_comment = {
            'user_id': ObjectId(current_user),
            'text': data['text']
        }

        db.posts.update_one({'_id': ObjectId(post_id)}, {'$push': {'comments': new_comment}})
        return jsonify({'message': 'Comment added successfully'}), 200

    except Exception as e:
        return jsonify({'message': f'Error during commenting on post: {e}'}), 500

@app.route('/share/<string:post_id>', methods=['POST'])
@jwt_required()
def share_post(post_id):
    try:
        current_user = get_jwt_identity()

        db.posts.update_one({'_id': ObjectId(post_id)}, {'$push': {'shares': current_user}})
        return jsonify({'message': 'Post shared successfully'}), 200

    except Exception as e:
        return jsonify({'message': f'Error during sharing post: {e}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
