import pymongo
from flask import Blueprint, jsonify

connection = pymongo.MongoClient("mongodb://localhost:27017/")
db = connection.get_database('practice')
col = db.get_collection('yeardream3')

apis = Blueprint(__name__, 'apis')

@apis.route('/api/statistics_card', methods=["GET"])
def statistics_card():
    totals = {}
    for c in col.find():
        totals[c["_id"]] = c["date_total"]
    return jsonify(totals)

@apis.route('/api/news_list', methods=["GET"])
def news_list():
    result = {}
    for c in col.find():
        news_for_specific_date = {}
        for news_tuple in c["top_newses"]:
            newses = []
            cnt = 0
            for news in news_tuple[2]:
                newses.append(news)
                cnt += 1
                if cnt == 50:
                    break
            news_for_specific_date[news_tuple[0]] = newses
        result[c["_id"]] = news_for_specific_date

    return jsonify(result)

@apis.route('/api/infections_count', methods=["GET"])
def infection():
    result = {}
    for c in col.find():
        result[c["_id"]] = 0
    result['2021.11.16'] = 2125

    return jsonify(result)
