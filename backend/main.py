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

def get_posts(posts, connections, friends_list, user_id):    
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

def get_friend_list(connections, friends_list, user_id):
    # Find user's friends
    friends = [friend['user_id'] for connection in connections for friend in friends_list if connection['user_id'] == user_id and friend['user_id'] in connection['friend_id']]
    print(friends)

id = input("Enter User ID:")
user_id = int(id)

get_posts(posts_list, connections, friends_list, user_id)
get_friend_list(connections, friends_list, user_id)
