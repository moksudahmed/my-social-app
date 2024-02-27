print("Social App")


def create_post(posts_list, user_id):
    post_text = input("Enter your post:")    
    scope = input("Enter your post scope:")
    new_post ={
        'text': post_text,
        'user_id': int(user_id),
        'scope' : scope
    }     
    posts_list.append(new_post)

def get_friend_list_by_id(connections, user_id):
    try:
        newlist = [conn for conn in connections if conn['user_id']==user_id][0]
        if newlist:
            return newlist['friend_id']
        else: 
            return None
    except Exception as e:
        return e    

def check_block_list(connections, friends, user_id):
    blist = [f for f in friends if any(user_id in x.get('blocked_id', []) for x in connections if x['user_id'] == f)]
    return blist

def get_posts(posts, connections, friends_list, user_id):    
    try:
        # Find user's name
        username = next((friend['name'] for friend in friends_list if friend['user_id'] == user_id), None)
        if username:
            print(username)
            # Find user's friends
            user_connections = next((connection for connection in connections if connection['user_id'] == user_id), None)
            #print(check_block_list(user_connections['friend_id'], user_id))
            if user_connections:
                user_friends = user_connections['friend_id']
                user_blocked = check_block_list(connections, user_connections['friend_id'], user_id) #user_connections['blocked_id']                
            else:
                user_friends = []
                user_blocked = []
            newlist = [friend for friend in user_friends if friend not in user_blocked]
            newlist.append(user_id)
            # Add user to the list of friends if not blocked
            #user_friends.append(user_id) if user_id not in user_blocked else None
           # print(user_friends)
            # Find posts of the user and their friends (including public posts if user is the author and not blocked)
            user_and_friends_posts = [post for post in posts if post['user_id'] in newlist
                                       and (post['scope'] == 'public' or post['user_id'] == user_id)]
            
            if user_and_friends_posts:
                print("User {} and their friends' posts:".format(user_id))
                for post in user_and_friends_posts:
                    print(next((friend['name'] for friend in friends_list if friend['user_id'] == post['user_id']), None) +' ['+ post['text'] +']')
            else:
                print("No posts found for user {} and their friends.".format(user_id))
        else:
            print("User with ID {} not found.".format(user_id))
    except Exception as e:
        return e

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

def send_request(friend_request, user_id):
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

def get_friend_request(friend_request, friends_list, user_id):    
    flist = [friend['friend_id'] for friend in friend_request]
    friend_data = [(friend['user_id'], friend['name']) for friend in friends_list if friend['user_id'] in flist and (flist['status'] == 'pending')]
    #flist = [(friend['user_id'], friend['name']) for friend in friends_list if friend['user_id'] in friends]
    print(friend_data)

def get_friend_requests_with_names(friend_request, friends_list, user_id):
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
    
def sent_requests_with_names(friend_request,friends_list, user_id):
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

def accept_friend_request(connections,friend_request, requester_id, friend_id):
    # Find the friend request to accept
    request_to_accept = next((request for request in friend_request if request['user_id'] == requester_id and request['friend_id'] == friend_id), None)
    
    if request_to_accept:
        # Update the status of the friend request to "accepted"
        request_to_accept['status'] = 'accepted'
        
        # Update the connections list for the requester
        for connection in connections:
            if connection['user_id'] == requester_id:
                if friend_id not in connection['friend_id']:
                    connection['friend_id'].append(friend_id)
                break
        else:
            # If the user_id doesn't exist in connections, create a new entry
            connections.append({'user_id': requester_id, 'friend_id': [friend_id]})
        
        # Update the connections list for the friend who accepted the request
        for connection in connections:
            if connection['user_id'] == friend_id:
                if requester_id not in connection['friend_id']:
                    connection['friend_id'].append(requester_id)
                break
        else:
            # If the user_id doesn't exist in connections, create a new entry
            connections.append({'user_id': friend_id, 'friend_id': [requester_id]})
        
        return True, "Friend request accepted successfully."
    else:
        return False, "Friend request not found or already accepted."

def get_index_by_user_id(connections, user_id):
    for index, connection in enumerate(connections):
        if connection['user_id'] == user_id:
            return index
    return -1  # Return -1 if user_id is not found in the connections list

def unfriend(connections, user_id1, user_id2):
    try:
        # Find the connection entries for both users
        index1 = get_index_by_user_id(connections, user_id1)
        index2 = get_index_by_user_id(connections, user_id2)
        
        if index1 != -1 and index2 != -1:
            connection1 = connections[index1]
            connection2 = connections[index2]
            
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

def blocked(connections, user_id1, user_id2):
    try:
        # Find the connection entries for both users
        index1 = get_index_by_user_id(connections, user_id1)                
        if index1 != -1:
            connection1 = connections[index1]            
            # Remove user_id2 from user_id1's friend list
            if user_id2 in connection1['friend_id']:               
                connection1['blocked_id'].insert(index1, user_id2)     
            return True, "Successfully blocked."
        else:
            return False, "One or both users are not found in the connections list."
    except Exception as e:
        return False, str(e)

def accept_request(connections, friend_request, requester_id, friend_id):
    print(requester_id, friend_id)
    request_to_accept1 = next((request for request in friend_request if request['user_id'] == requester_id and request['friend_id'] == friend_id), None)
    request_to_accept2 = next((request for request in friend_request if request['friend_id'] == requester_id and request['user_id'] == friend_id), None)
    
    if request_to_accept1 or request_to_accept2:
        if request_to_accept1:
            print(accept_friend_request(connections, friend_request, requester_id, friend_id))
        else:
            print(accept_friend_request(connections, friend_request, friend_id, requester_id))
    

def init():
    posts_list = [{'text':'Hello World', 'user_id':1,'scope':'public'},
              {'text':'Good Morning', 'user_id':3,'scope':'public'},
              {'text':'Good Night', 'user_id':4,'scope':'public'},
              {'text':'Good Evening', 'user_id':1,'scope':'public'},
              {'text':'This is awesome', 'user_id':2,'scope':'public'}]

    connections = [{'user_id':1, 'friend_id':[3, 4, 2], 'blocked_id':[4]},
                {'user_id':3, 'friend_id':[1, 4], 'blocked_id':[]},
                {'user_id':4, 'friend_id':[2, 1, 3], 'blocked_id':[]}]

    friends_list = [{'user_id':1,'name':"Moksud"},
                    {'user_id':2,'name':"Fuad"},
                    {'user_id':3,'name':"Azad"},
                    {'user_id':4,'name':"Ashik"},
                    {'user_id':5,'name':"Affan"}]

    friend_request =[{'user_id':2, 'friend_id':4, 'status': 'pending'},
                    {'user_id':2, 'friend_id':3, 'status': 'pending'}]

    while True:
        print("1. Post")
        print("2. Friend List")
        print("3. Create Post")
        print("4. Send Request")
        print("5. Connections")
        print("6. Pending Request")
        print("7. Accept Request")
        print("8. Friend Request")
        print("9. Unfriend")
        print("10. Blocked User")
        choice = input("Enter your choice:")
        id = input("Enter User ID:")
        user_id = int(id)        
        if choice == '1':  
            get_posts(posts_list, connections, friends_list, user_id)
        elif choice =='2':
            friend_list = get_friend_list(connections, friends_list, user_id)
            print(friend_list)
        elif choice=='3':
            create_post(posts_list,user_id)
            get_posts(posts_list, connections, friends_list, user_id)        
        elif choice=='4':    
            send_request(friend_request, user_id)
        elif choice =='5':
            print(connections)
        elif choice =='6':
            #get_friend_request(user_id)
            print(get_friend_requests_with_names(friend_request,friends_list, user_id))
        elif choice == '7':
            id = input("Enter Friend ID:")
            friend_id = int(id)
            accept_request(connections, friend_request, user_id, friend_id)
            
        elif choice =='8':
            print(friend_request)
        elif choice =='9':
            id = input("Enter Friend ID:")
            friend_id = int(id)            
            unfriend(connections, user_id, friend_id)
            print(connections)
            #print(accept_friend_request(user_id, friend_id))
        elif choice =='10':
            id = input("Enter Friend ID:")
            friend_id = int(id)            
            blocked(connections, user_id, friend_id)
            print(connections)                
        else : break 
init()
        # Test the function
