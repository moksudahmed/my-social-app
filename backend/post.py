from marshmallow import Schema, fields, validate
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
from werkzeug.datastructures import  FileStorage

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class PostSchema(Schema):
      content = fields.Str(required=True, validate=validate.Length(min=1, max=1000))
      content_type = fields.Str(required=True)
      scope= fields.Str(required=True) 
     
class User:
     def __init__(self, user_id, username, firstname, lastname):
          self.user_id = user_id
          self.username = username
          self.firstname = firstname
          self.lastname = lastname
        
class Connections:
     def __init__(self, user_id, friend_id=[], blocked_id=[]):
         self.user_id = user_id
         self.friend_id = friend_id
         self.blocked_id = blocked_id

class Post:
    def __init__(self, post_id, user_id, content, content_type, scope='public'):
        self.post_id = post_id
        self.user_id = user_id
        self.content = content
        self.content_type = content_type
        self.scope = scope

    def get_content(self):
        return self.content

    def get_user_id(self):
        return self.user_id

    def get_scope(self):
        return self.scope


class SocialApp:
    def __init__(self, *posts):
        # Initialize an empty list to store posts
        self.posts_list = [{'text':'Hello World', 'user_id':1,'scope':'public'},
              {'text':'Good Morning', 'user_id':3,'scope':'public'},
              {'text':'Good Night', 'user_id':4,'scope':'public'},
              {'text':'Good Evening', 'user_id':1,'scope':'public'},
              {'text':'This is awesome', 'user_id':2,'scope':'public'}]

        self.connections = [{'user_id':1, 'friend_id':[3, 4, 2], 'blocked_id':[4]},
                {'user_id':3, 'friend_id':[1, 4], 'blocked_id':[]},
                {'user_id':4, 'friend_id':[2, 1, 3], 'blocked_id':[]}]

        self.friends_list = [{'user_id':1,'name':"Moksud"},
                        {'user_id':2,'name':"Fuad"},
                        {'user_id':3,'name':"Azad"},
                        {'user_id':4,'name':"Ashik"},
                        {'user_id':5,'name':"Affan"}]

        self.friend_request =[{'user_id':2, 'friend_id':4, 'status': 'pending'},
                    {'user_id':2, 'friend_id':3, 'status': 'pending'}]

        # Add posts to the list
        for post in posts:
            self.posts_list.append(post)

    def get(self):
        # Return the content of all posts
        return [post.get_content() for post in self.posts_list]

    def create_post(self, user_id, post_text,scope):
        new_post = Post(len(self.posts_list) + 1, user_id, post_text, 'text', scope)
        self.posts_list.append(new_post)

    def check_block_list(self, friends, user_id):
        blist = [f for f in friends if any(user_id in x.get('blocked_id', []) for x in self.connections if x['user_id'] == f)]
        return blist

    def get_posts(self, user_id):
        # Find user's name
        username = next((friend['name'] for friend in self.friends_list if friend['user_id'] == user_id), None)
        if username:
            print(username)
            # Find user's friends
            user_connections = next((connection for connection in self.connections if connection['user_id'] == user_id), None)
            if user_connections:
                user_friends = user_connections['friend_id']
                user_blocked = self.check_block_list(user_connections['friend_id'], user_id)
            else:
                user_friends = []
                user_blocked = []
            newlist = [friend for friend in user_friends if friend not in user_blocked]
            newlist.append(user_id)

            # Find posts of the user and their friends (including public posts if user is the author and not blocked)
            user_and_friends_posts = [post for post in self.posts_list if post.get_user_id() in newlist
                                      and (post.get_scope() == 'public' or post.get_user_id() == user_id)]

            if user_and_friends_posts:
                return [post.get_content() for post in user_and_friends_posts]
            else:
                return "No posts found for user {} and their friends.".format(user_id)
        else:
            return "User with ID {} not found.".format(user_id)
        
    def get_friend_list(self, user_id):
        try:
            # Find user's friends
            friends = [friend['user_id'] for connection in self.connections for friend in self.friends_list if connection['user_id'] == user_id and friend['user_id'] in connection['friend_id']]

            # Extract user_id and name of friends
            friend_data = [(friend['user_id'], friend['name']) for friend in self.friends_list if friend['user_id'] in friends]
            
            if friend_data:
                return friend_data
            else: 
                return None
        except Exception as e:
                return e 
        
    def get_friend_list_by_id(self, user_id):
        try:
            newlist = [conn for conn in self.connections if conn['user_id']==user_id][0]
            if newlist:
                return newlist['friend_id']
            else: 
                return None
        except Exception as e:
            return e    
        
    def send_request(self, user_id, friend_id):
        
        # Check if the friend request already exists
        if any(request['user_id'] == user_id and request['friend_id'] == friend_id for request in self.friend_request):
            print("Friend request already sent or pending.")
            return

        if any(request['friend_id'] == user_id and request['user_id'] == friend_id for request in self.friend_request):
            print("Friend request already sent or pending.")
            return
        # If the friend request does not exist, add it to the list
        self.friend_request.append({'user_id': user_id, 'friend_id': friend_id, 'status': 'pending'})
        
        print("Friend request sent successfully.")
        print(self.friend_request)  
        
    def get_friend_request(self, user_id):    
      friend_data = []
      for request in self.friend_request:
          if request['friend_id'] == user_id and request['status'] == 'pending':
              requester_id = request['user_id']
              requester_name = next((friend['name'] for friend in self.friends_list if friend['user_id'] == requester_id), None)
              if requester_name:
                  friend_data.append({'user_id': requester_id, 'name': requester_name})
      return friend_data

    def accept_friend_request(self, requester_id, friend_id):
      # Find the friend request to accept
      request_to_accept = next((request for request in self.friend_request if request['user_id'] == requester_id and request['friend_id'] == friend_id), None)
      if request_to_accept:
          # Update the status of the friend request to "accepted"
          request_to_accept['status'] = 'accepted'
          
          # Update the connections list for the requester
          for connection in self.connections:
              if connection['user_id'] == requester_id:
                  if friend_id not in connection['friend_id']:
                      connection['friend_id'].append(friend_id)
                  break
          else:
              # If the user_id doesn't exist in connections, create a new entry
              self.connections.append({'user_id': requester_id, 'friend_id': [friend_id]})
          
          # Update the connections list for the friend who accepted the request
          for connection in self.connections:
              if connection['user_id'] == friend_id:
                  if requester_id not in connection['friend_id']:
                      connection['friend_id'].append(requester_id)
                  break
          else:
              # If the user_id doesn't exist in connections, create a new entry
              self.connections.append({'user_id': friend_id, 'friend_id': [requester_id]})
          
          return self.connections
      else:
          return False

    def accept_request(self, requester_id, friend_id):
      print(requester_id, friend_id)
      request_to_accept1 = next((request for request in self.friend_request if request['user_id'] == requester_id and request['friend_id'] == friend_id), None)
      request_to_accept2 = next((request for request in self.friend_request if request['friend_id'] == requester_id and request['user_id'] == friend_id), None)
      
      if request_to_accept1 or request_to_accept2:
          if request_to_accept1:
              print(self.accept_friend_request(requester_id, friend_id))
          else:
              print(self.accept_friend_request(friend_id, requester_id))
    
    def unfriend(self, user_id1, user_id2):
      try:
          # Find the connection entries for both users
          index1 = self.get_index_by_user_id(self.connections, user_id1)
          index2 = self.get_index_by_user_id(self.connections, user_id2)
          
          if index1 != -1 and index2 != -1:
              connection1 = self.connections[index1]
              connection2 = self.connections[index2]
              
              # Remove user_id2 from user_id1's friend list
              if user_id2 in connection1['friend_id']:
                  connection1['friend_id'].remove(user_id2)
              
              # Remove user_id1 from user_id2's friend list
              if user_id1 in connection2['friend_id']:
                  connection2['friend_id'].remove(user_id1)
              return True, "Successfully unfriended."
          else:
              return False, "One or both users are not found in the connections list."
      except Exception as e:
          return False, str(e)

    def blocked(self, user_id1, user_id2):
        try:
            # Find the connection entries for both users
            index1 = self.get_index_by_user_id(self.connections, user_id1)                
            if index1 != -1:
                connection1 = self.connections[index1]            
                # Remove user_id2 from user_id1's friend list
                if user_id2 in connection1['friend_id']:               
                    connection1['blocked_id'].insert(index1, user_id2)     
                return True, "Successfully blocked."
            else:
                return False, "One or both users are not found in the connections list."
        except Exception as e:
            return False, str(e)

def menu():
      print("1. Post")      
      print("2. Create Post")
      print("3. Friend List")
      print("4. Send Request")
      print("5. Connections")
      print("6. Pending Request")
      print("7. Accept Request")
      print("8. Friend Request")
      print("9. Unfriend")
      print("10. Blocked User")


def init():
    app = SocialApp()
    while True:
        menu()
        choice = input("Enter your choice:")
        id = input("Enter User ID:")
        user_id = int(id)        
        if choice == '1':
          print(app.get_posts(user_id))
  
        elif choice == '2':
          app.create_post(1, 'Hello World', 'public')
          app.create_post(1, 'Good Morning', 'public')
          app.create_post(1, 'Good Night', 'public')
        elif choice == '3':  
          print(app.get_friend_list(1))
        elif choice == '4':           
          friend_id = int(input("Enter Friend ID:"))
          user_id = int(input("Enter User ID:"))
          friend_id = int(input("Enter Friend ID:"))
          app.send_request(user_id, friend_id)
        elif choice == '6':      
          print(app.get_friend_request(user_id))

        elif choice == '7':  
          app.accept_request(2, 4)
          print(app.get_friend_list(2))
        else: break

app = Flask(__name__)
social_app = SocialApp()  # Create an instance of SocialApp


@app.route('/post', methods=['POST'])
#@jwt_required()
def post():
    try:
        data = request.get_json()

        content_type = data.get('content_type', 'text')  # Default to text if not provided
        content = data.get('content')

        if not content:
            return jsonify({'message': 'Content is required'}), 400

        social_app.create_post(1, content, 'public')
        return jsonify({'message': 'Post created successfully', 'post_id': 1}), 201

    except Exception as e:
        return jsonify({'message': f'Error during post creation: {e}'}), 500


@app.route('/posts', methods=['GET'])
#@jwt_required()
def get_all_posts():
    try:
        posts = social_app.get_posts(1)  # Assuming user_id 1
        serialized_posts = []
        print(posts)
        for post in posts:
            serialized_post = {
                
                'content': post.content
                
            }
            serialized_posts.append(serialized_post)

        return jsonify(serialized_posts), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
