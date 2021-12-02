import pymongo
from flask import Blueprint, jsonify, request

apis = Blueprint(__name__, 'apis')

db_name = 'final_data'
col_name_selectors = 'selectors'
col_name_statistics = 'statistics'
col_name_ifections = 'infection'
col_name_rankings = 'rankings'
col_name_line_graph = 'line_graph'
col_name_newses = 'newses'

connection = pymongo.MongoClient("mongodb://localhost:27017/")
db = connection.get_database(db_name)

col_selectors = db.get_collection(col_name_selelectors)
col_statistics = db.get_collection(col_name_statistics)
col_infections = db.get_collection(col_name_infections)
col_rankings = db.get_collection(col_name_rankings)
col_line_graph = db.get_collection(col_name_line_graph)
col_newses = db.get_collection(col_name_newses)


@apis.route('/api/statistics', methods=["GET"])
def statistics():
    selected_date = request.args.get("date")
    selected_keyword = request.args.get("keyword")
    selected_company = request.args.get("company")

    data1 = col_statistics.find_one({"date":selected_date, "keyword":selected_keyword, "company":selected_company})

    data2 = col_infections.find_one({"date":selected_data})

    result1 = {
        "total": data1["total"],
        "positive": data1["positive"],
        "negative": data1["negative"],
        "normal": data1["normal"],
        "infections": data2["corona"]
    }

    if selected_company != "total"
        return jsonify(result1)

    result2 = col_rankings.find_one({"date":selected_date, "keyword":selected_keyword, "company":"total"})

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

    return jsonify(col_selectors.find_one({}))

@apis.route('/api/line_graph', methods=["GET"])
def line_graph():
    month_str = request.args.get("month")
    if len(month_str) == 1:
        month_str = '0' + month_str

    return jsonify(list(col_line_graph.fin

@apis.route('/api/line_graph6', methods=["GET"])
def line_graph6():
    month = int(request.args.get("month"))
    version = int(request.args.get("version"))

    return jsonify(gl6.getLineGraph6Data(month, version))

@apis.route('/api/line_graph6_year', methods=["GET"])
def line_graph6_year():
    version = int(request.args.get("version"))
    return jsonify(gl6.getLineGraph6DataYear(version))

@apis.route('/api/infections', methods=["GET"])
def infections():
    month = int(request.args.get("month"))

    return jsonify(gi.getInfectionsData(month))

@apis.route('/api/infections_year', methods=["GET"])
def infections_year():
    return jsonify(gi.getInfectionsDataYear())



