import pymongo
from flask import Blueprint, jsonify

connection = pymongo.MongoClient("mongodb://localhost:27017/")
db = connection.get_database('practice')
col = db.get_collection('yeardream3')

apis = Blueprint(__name__, 'apis')

@apis.route('/api/statistics_card')
def card():
    totals = {}
    for c in col.find():
        totals[c["_id"]] = c["date_total"]
    return jsonify(totals)



