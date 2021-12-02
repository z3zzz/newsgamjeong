import pymongo
from flask import Blueprint, jsonify, request

apis = Blueprint(__name__, 'apis')

db_name = 'final_data'
col_name_selectors = 'selectors'
col_name_statistics = 'statistics'
col_name_infections = 'infections'
col_name_rankings = 'rankings'
col_name_line_graph = 'line_graph'
col_name_newses = 'newses'

connection = pymongo.MongoClient("mongodb://localhost:27017/")
db = connection.get_database(db_name)

col_selectors = db.get_collection(col_name_selectors)
col_statistics = db.get_collection(col_name_statistics)
col_infections = db.get_collection(col_name_infections)
col_rankings = db.get_collection(col_name_rankings)
col_line_graph = db.get_collection(col_name_line_graph)
col_newses = db.get_collection(col_name_newses)

def parse_json(data):
    return json.loads(json_util.dumps(data))

@apis.route('/api/statistics', methods=["GET"])
def statistics():
    selected_date = request.args.get("date")
    selected_keyword = request.args.get("keyword")
    selected_company = request.args.get("company")

    data1 = col_statistics.find_one({"date":selected_date, "keyword":selected_keyword, "company":selected_company})

    data2 = col_infections.find_one({"date":selected_date})

    result1 = {
        "total": data1["total"],
        "positive": data1["positive"],
        "negative": data1["negative"],
        "normal": data1["normal"],
        "infections": data2["corona"]
    }

    if selected_company != "total":
        return jsonify(result1)

    result2 = col_rankings.find_one({"date":selected_date, "keyword":selected_keyword})
    result2["_id"] = 0

    return jsonify({
        "statistics": result1,
        "news_ranking": result2,
    })


@apis.route('/api/newses', methods=["GET"])
def news_list():
    selected_date = request.args.get("date")
    selected_keyword = request.args.get("keyword")
    selected_company = request.args.get("company")


    result = list(col_newses.find({"date":selected_date, "keyword":selected_keyword, "company":"total"}).limit(10000))

    return jsonify(result)


@apis.route('/api/selectors', methods=["GET"])
def selectors():

    result = col_selectors.find_one()
    result["_id"] = 0
    return jsonify(result)

@apis.route('/api/line_graph', methods=["GET"])
def line_graph():
    month_str = request.args.get("month")
    month_int = int(month_str)
    if month_int == 12:
        return {"result":"fail", "reason":"12월은 아직 없습니다 :("}
    if len(month_str) == 1:
        month_str = '0' + month_str

    return jsonify(list(col_line_graph.find({"month": month_str})))

@apis.route('/api/line_graph_year', methods=["GET"])
def line_graph_year():
    return jsonify(list(col_line_graph.find({})))

@apis.route('/api/infections', methods=["GET"])
def infections():
    month_str = request.args.get("month")
    month_int = int(month_str)
    if month_int == 12:
        return {"result":"fail", "reason":"12월은 아직 없습니다 :("}
    if len(month_str) == 1:
        month_str = '0' + month_str

    return jsonify(list(col_infections.find({"month": month_str})))

@apis.route('/api/infections_year', methods=["GET"])
def infections_year():
    return jsonify(list(col_infections.find({})))



