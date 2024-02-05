class Connection(db.Document):
    user_id = db.ReferenceField('User')
    friend_id = db.ReferenceField('User')
    status = db.StringField(default="pending")