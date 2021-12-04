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
col_name_wordcloud = 'wordcloud'
col_name_lda = 'lda'

connection = pymongo.MongoClient("mongodb://localhost:27017/")
db = connection.get_database(db_name)

col_selectors = db.get_collection(col_name_selectors)
col_statistics = db.get_collection(col_name_statistics)
col_infections = db.get_collection(col_name_infections)
col_rankings = db.get_collection(col_name_rankings)
col_line_graph = db.get_collection(col_name_line_graph)
col_newses = db.get_collection(col_name_newses)
col_wordcloud = db.get_collection(col_name_wordcloud)
col_lda = db.get_collection(col_name_lda)

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

    query_arr = []
    if selected_date != "total":
        query_arr.append({"date": selected_date})
    if selected_keyword != "total":
        query_arr.append({"category": selected_keyword})
    if selected_company != "total":
        query_arr.append({"text_company": selected_company })


    limit = 1000
    offset = 0

    if selected_date == "total" and selected_keyword == "total" and selected_company == "total":
        result = list(
            col_newses.find({}, {"_id": 0})
            .limit(limit)
            .skip(offset)
        )
    else:
        query = {"$and": query_arr}
        result = list(
            col_newses.find(query, {"_id": 0})
            .limit(limit)
            .skip(offset)
        )

    return jsonify(result)


@apis.route('/api/selectors', methods=["GET"])
def selectors():

    result = col_selectors.find_one()
    result["_id"] = 0
    return jsonify(result)

@apis.route('/api/update_company_selectors', methods=["GET"])
def update_company_selectors():
    selected_date = request.args.get("date")
    selected_keyword = request.args.get("keyword")

    minimum_criteria = 1

    result = []
    for c in col_statistics.find({"date": selected_date, "keyword": selected_keyword, "company": {"$ne":"total"}}):
        if c["total"] <  minimum_criteria:
            continue
        result.append(c["company"])

    return jsonify(result)

@apis.route('/api/update_keyword_selectors', methods=["GET"])
def update_keyword_selectors():
    selected_date = request.args.get("date")
    selected_company = request.args.get("company")

    minimum_criteria = 1

    result = []
    for c in col_statistics.find({"date": selected_date, "keyword": {"$ne": "total"}, "company": selected_company}):
        if c["total"] <  minimum_criteria:
            continue
        result.append(c["keyword"])

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


@apis.route('/api/wordcloud', methods=["GET"])
def wordcloud():
    month = request.args.get("month")
    keyword = request.args.get("keyword")

    return jsonify(col_wordcloud.find_one({"month": month, "keyword": keyword}, {"_id":0}))

@apis.route('/api/lda', methods=["GET"])
def lda():
    month = request.args.get("month")

    return jsonify(col_lda.find_one({"month": int(month)}, {"_id":0}))
