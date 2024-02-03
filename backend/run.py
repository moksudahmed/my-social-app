from flask import Flask, render_template, request, jsonify, send_from_directory
from pymongo import MongoClient
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from bson import ObjectId
from flask_cors import CORS
from bson import json_util
import json
from flask_restful import Api, Resource
import os
from flask_uploads import UploadSet, configure_uploads, IMAGES
import uuid  # Import the uuid module for generating unique identifiers
from werkzeug.utils import secure_filename
from datetime import datetime


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
app.config['UPLOADED_IMAGES_DEST'] = 'uploads'  # Folder to store uploaded images

images = UploadSet('images', IMAGES)
configure_uploads(app, images)
APP_ROOT = os.path.dirname(os.path.abspath(__file__))

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


@app.route('/get_user/<user_id>')
def get_user(user_id):
    try:
        #user_id = request.get_json()
        
        user = db.users.find_one({'_id': ObjectId(user_id)})
        name = user['firstname'] + ' '+ user['lastname']
        if user:                        
            return jsonify({'name': name}), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'message': f'Error loading: {e}'}), 500

@app.route('/get_user_by_username/<username>')
def get_user_by_username(username):
    try:
        #user_id = request.get_json()
        
        user = db.users.find_one({'username': username})
        name = user['firstname'] + ' '+ user['lastname']
        if user:                        
            return jsonify({'name': name}), 200
        else:
            return jsonify({'message': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'message': f'Error loading: {e}'}), 500

@app.route('/post', methods=['POST'])
@jwt_required()
def post():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()

        content_type = data.get('content_type', 'text')  # Default to text if not provided
        content = data.get('content')

        if not content:
            return jsonify({'message': 'Content is required'}), 400

        new_post = {
            'user_id': ObjectId(current_user),
            'content_type': content_type,
            'content': content,
            'likes': [],
            'comments': [],
            'shares': [],
            'created_at': datetime.utcnow()
        }

        post_id = db.posts.insert_one(new_post).inserted_id
        return jsonify({'message': 'Post created successfully', 'post_id': str(post_id)}), 201

    except Exception as e:
        return jsonify({'message': f'Error during post creation: {e}'}), 500

# New endpoint for photo upload

@app.route('/posts/photo', methods=['POST'])
@jwt_required()
def upload_image():
    try:
        current_user = get_jwt_identity()
        target = os.path.join(APP_ROOT, 'uploads/')
        metadata_collection =  db.posts
        if not os.path.isdir(target):
            os.mkdir(target)
        
        if 'images' not in request.files:
            return jsonify({'message': 'No images provided'}), 400

        images = request.files.getlist('images')
        metadata =[]
        for image in images:
            # Generate a unique identifier (UUID) for each image
            image_id = str(uuid.uuid4())

            # Use the image_id to create a unique filename
            filename = f"{image_id}_{secure_filename(image.filename)}"
            image_path = os.path.join(app.config['UPLOADED_IMAGES_DEST'], filename)
            image.save(image_path)

            # Store metadata in MongoDB
            ds = {
                'user_id': current_user,  # Assuming user_id is stored in the JWT token
                'id': image_id,
                'filename': filename,
                'size': os.path.getsize(image_path),
                'url': f'/uploads/{filename}'
            }
            metadata.append(ds)
        print(metadata)
        content_type = 'photo'
            #metadata_collection.insert_one(metadata)
        new_post = {
                'user_id': ObjectId(current_user),
                'content_type': content_type,
                'content': metadata,
                'likes': [],
                'comments': [],
                'shares': [],
                'created_at': datetime.utcnow()
            }
        post_id = db.posts.insert_one(new_post).inserted_id
        return jsonify({'message': 'Images uploaded successfully'}), 201
    except Exception as e:
        return jsonify({'message': f'Error during image upload: {e}'}), 500

@app.route('/images/<filename>')
def get_image(filename):
    return send_from_directory(app.config['UPLOADED_IMAGES_DEST'], filename)

#@app.route('/post', methods=['POST'])
#@jwt_required()
def post2():
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

@app.route('/posts/reply', methods=['POST'])
@jwt_required()
def post_reply():
    try:
        
        current_user = get_jwt_identity()
        data = request.get_json()
        
        post_id = data.get('post_id')
        comment_id = data.get('comment_id')
        reply_text = data.get('text')
        
        if not (post_id and comment_id and reply_text):
            return jsonify({'message': 'Invalid request parameters'}), 400

        reply = {
            '_id': ObjectId(),  # Generate a new ObjectId for the reply
            'user_id': ObjectId(current_user),
            'text': reply_text,
        }
        
        # Update the comment with the new reply
        
        result = db.posts.update_one(
            {'_id': ObjectId(post_id), 'comments.user_id': ObjectId(comment_id)},
            {'$push': {'comments.$.replies': reply}}
        )

        print(result)
        if result.modified_count == 0:
            return jsonify({'message': 'Failed to post reply'}), 400

        return jsonify({'message': 'Reply posted successfully', 'reply_id': str(reply['_id'])}), 201

    except Exception as e:
        return jsonify({'message': f'Error during reply submission: {e}'}), 500


@app.route('/posts', methods=['GET'])
@jwt_required()
def get_all_posts():
    try:
        current_user = get_jwt_identity()
        # Assuming you have a 'posts' collection in your MongoDB
        #posts = list(db.posts.find())
        posts =list(db.posts.find().sort({"created_at": -1}))  
        #posts = list(db.posts.find({'user_id': current_user}))
        #posts = list(db.posts.find({'user_id': ObjectId(current_user)}))
        
        # Use json_util to serialize ObjectId
        serialized_posts = json.loads(json_util.dumps(posts))

        return jsonify(serialized_posts), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/posts/like', methods=['POST'])
@jwt_required()
def like_post():
    try:
        current_user = get_jwt_identity()
        post_id = request.json.get('post_id')

        urrent_user = get_jwt_identity()

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


def like_post_working_copy():
    try:
        current_user = get_jwt_identity()
        post_id = request.json.get('post_id')
       
        # Assuming you have a 'likes' collection in your MongoDB
        # Replace 'your_likes_collection' with the actual name of your collection
        likes_collection = db['your_likes_collection']

        # Check if the user already liked the post
        existing_like = likes_collection.find_one({'user_id': current_user, 'post_id': post_id})
        if existing_like:
            return jsonify({'message': 'You already liked this post'}), 400

        # Insert like
        like_data = {'user_id': current_user, 'post_id': post_id}
        likes_collection.insert_one(like_data)

        return jsonify({'message': 'Post liked successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/posts/comment', methods=['POST'])
@jwt_required()
def comment_post():
    try:
        current_user = get_jwt_identity()

        if not current_user:
            return jsonify({'message': 'Authentication required to comment'}), 401

        data = request.get_json()
        post_id = data.get('post_id')

        if not post_id:
            return jsonify({'message': 'Invalid post_id'}), 400

        new_comment = {
            'user_id': ObjectId(current_user),
            'text': data.get('text')
        }

        # Assuming you have a MongoDB collection named 'posts'
        result = db.posts.update_one({'_id': ObjectId(post_id)}, {'$push': {'comments': new_comment}})

        if result.modified_count > 0:
            return jsonify({'message': 'Comment added successfully'}), 200
        else:
            return jsonify({'message': 'Post not found'}), 404

    except Exception as e:
        return jsonify({'message': f'Error during commenting on post: {e}'}), 500


#@app.route('/comment/<string:post_id>', methods=['POST'])
#@app.route('/posts/comment', methods=['POST'])
#@jwt_required()
def comment_post2():    
    try:
        current_user = get_jwt_identity()
        data = request.get_json()        
        post_id = post_id = request.json.get('post_id')
        print(post_id)    
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
