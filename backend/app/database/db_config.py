from pymongo.mongo_client import MongoClient
import os
client = MongoClient(os.getenv("MONGODB_URL"))
db = client["time-track"]

user_db = db["Users"]