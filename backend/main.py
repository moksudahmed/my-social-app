print("Social App")
posts_list = [{'text':'Hello World', 'user_id':1,'scope':'public'},
              {'text':'Good Morning', 'user_id':3,'scope':'public'},
              {'text':'Good Night', 'user_id':4,'scope':'public'},
              {'text':'Good Evening', 'user_id':1,'scope':'private'},
              {'text':'This is awesome', 'user_id':2,'scope':'public'}]

connections = [{'user_id':1, 'friend_id':[3, 4, 2]},
               {'user_id':3, 'friend_id':[1, 4]},
               {'user_id':4, 'friend_id':[2]}]

friends_list = [{'user_id':1,'name':"Moksud"},
                {'user_id':2,'name':"Fuad"},
                {'user_id':3,'name':"Azad"},
                {'user_id':4,'name':"Ashik"},
                {'user_id':5,'name':"Fuad"}]

friend_request =[{'user_id':2, 'friend_id':4, 'status': 'pending'},
                 {'user_id':2, 'friend_id':3, 'status': 'pending'}]

def create_post(user_id):
    post_text = input("Enter your post:")    
    scope = input("Enter your post scope:")
    new_post ={
        'text': post_text,
        'user_id': int(user_id),
        'scope' : scope
    }     
    posts_list.append(new_post)

def get_posts(posts, connections, friends_list, user_id):    
    #try:
        # Find user's name
        username = next((friend['name'] for friend in friends_list if friend['user_id'] == user_id), None)
        if username:
            print(username)
            # Find user's friends
            user_friends = [connection['friend_id'] for connection in connections if connection['user_id'] == user_id]
            user_friends = user_friends[0] if user_friends else []
            # Add user to the list of friends
            user_friends.append(user_id)

            # Find posts of the user and their friends (including private posts if user is the author)
            user_and_friends_posts = [post for post in posts if post['user_id'] in user_friends and (post['scope'] != 'private' or post['user_id'] == user_id)]
            if user_and_friends_posts:
                print("User {} and their friends' posts:".format(user_id))
                for post in user_and_friends_posts:
                    print(post['text'])
            else:
                print("No posts found for user {} and their friends.".format(user_id))
        else:
            print("User with ID {} not found.".format(user_id))
    #except Exception as e:
     #       return e
def get_friend_list(connections, friends_list, user_id):
    try:
        # Find user's friends
        friends = [friend['user_id'] for connection in connections for friend in friends_list if connection['user_id'] == user_id and friend['user_id'] in connection['friend_id']]

        # Extract user_id and name of friends
        friend_data = [(friend['user_id'], friend['name']) for friend in friends_list if friend['user_id'] in friends]
        
        if friend_data:
            return friend_data
        else: 
            return None
    except Exception as e:
            return e 

def send_request(user_id):
    friend_id = int(input("Enter Friend ID:"))

    # Check if the friend request already exists
    if any(request['user_id'] == user_id and request['friend_id'] == friend_id for request in friend_request):
        print("Friend request already sent or pending.")
        return

    if any(request['friend_id'] == user_id and request['user_id'] == friend_id for request in friend_request):
        print("Friend request already sent or pending.")
        return
    # If the friend request does not exist, add it to the list
    friend_request.append({'user_id': user_id, 'friend_id': friend_id, 'status': 'pending'})
    
    print("Friend request sent successfully.")
    print(friend_request)

def get_friend_request(user_id):    
    flist = [friend['friend_id'] for friend in friend_request]
    friend_data = [(friend['user_id'], friend['name']) for friend in friends_list if friend['user_id'] in flist and (flist['status'] == 'pending')]
    #flist = [(friend['user_id'], friend['name']) for friend in friends_list if friend['user_id'] in friends]
    print(friend_data)

def get_friend_requests_with_names(user_id):
    request_list = []    
    for request in friend_request:
        if request['friend_id'] == user_id:            
            requester_id = request['user_id']
            friend_id = request['friend_id']
            status = request['status']

            requester_name = next((friend['name'] for friend in friends_list if friend['user_id'] == requester_id), None)
            friend_name = next((friend['name'] for friend in friends_list if friend['user_id'] == friend_id), None)
        
            if requester_name and friend_name:
                request_list.append({'user_id':requester_id, 'requester_name': requester_name, 'friend_id': friend_id ,'friend_name': friend_name, 'status': status})
    
    return request_list
    
def sent_requests_with_names(user_id):
    request_list = []    
    for request in friend_request:
        if request['user_id'] == user_id:            
            requester_id = request['user_id']
            friend_id = request['friend_id']
            status = request['status']

            requester_name = next((friend['name'] for friend in friends_list if friend['user_id'] == requester_id), None)
            friend_name = next((friend['name'] for friend in friends_list if friend['user_id'] == friend_id), None)
        
            if requester_name and friend_name:
                request_list.append({'user_id':requester_id, 'requester_name': requester_name, 'friend_id': friend_id ,'friend_name': friend_name, 'status': status})
    
    return request_list

def accept_friend_request(requester_id, friend_id):
    # Find the friend request to accept
    request_to_accept = next((request for request in friend_request if request['user_id'] == requester_id and request['friend_id'] == friend_id), None)
    
    if request_to_accept:
        # Update the status of the friend request to "accepted"
        request_to_accept['status'] = 'accepted'
        
        # Add the accepted friend to the connections list
        connections.append({'user_id': requester_id, 'friend_id': friend_id})
        
        return True, "Friend request accepted successfully."
    else:
        return False, "Friend request not found or already accepted."

while True:
    choice = input("Enter your choice:")
    id = input("Enter User ID:")
    user_id = int(id)
    
    if choice == '1':  
        get_posts(posts_list, connections, friends_list, user_id)

    elif choice =='2':
        friend_list = get_friend_list(connections, friends_list, user_id)
        print(friend_list)
    
    elif choice=='3':
        create_post(user_id)
        get_posts(posts_list, connections, friends_list, user_id)
    
    elif choice=='4':    
        send_request(user_id)

    elif choice =='5':
        print(connections)

    elif choice =='6':
        #get_friend_request(user_id)
        print(get_friend_requests_with_names(user_id))
    elif choice == '7':
        id = input("Enter Friend ID:")
        friend_id = int(id)
        print(accept_friend_request(user_id, friend_id))
    elif choice =='8':
        print(friend_request)
    else : break