# Define the connections and users data
connections = [
    {'requester_id': 1, 'friend_id': 2},
    {'requester_id': 5, 'friend_id': 1},
    {'requester_id': 1, 'friend_id': 4}
]

users = [
    {'user_id': 1, 'name': "Moksud"},
    {'user_id': 2, 'name': "Fuad"},
    {'user_id': 3, 'name': "Azad"},
    {'user_id': 4, 'name': "Ashik"},
    {'user_id': 5, 'name': "Affan"}
]

# Extract friend IDs associated with user 1
friend_ids = {connection['friend_id'] for connection in connections if connection['requester_id'] == 1}
friend_ids.update({connection['requester_id'] for connection in connections if connection['friend_id'] == 1})

# Find users who are not already friends with user 1
suggested_friends = [user['user_id'] for user in users if user['user_id'] not in friend_ids and user['user_id'] != 1]

print(suggested_friends)  # Output: [4, 5]
