from database.db_config import db
from pymongo import ReturnDocument


def get_next_sequence(name: str) -> int:
    counter = db["counter"].find_one_and_update(
        {"_id": name},
        {"$inc": {"seq": 1}},
        upsert=True,
        return_document=ReturnDocument.AFTER,
    )
    return counter["seq"]
