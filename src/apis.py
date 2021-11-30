import pymongo
from flask import Blueprint, jsonify, request
import concatParts as cp
import concatParts2 as cp2
import concatNewses as cn
import getSelectors as gs
import getSelectors2 as gs2
import getLineGraph as gl
import getLineGraph6 as gl6
import getInfections as gi

apis = Blueprint(__name__, 'apis')

def is_total_selected(selected_date, selected_keyword, selected_company):

    if selected_date == "total":
        is_date_total = True
    else:
        is_date_total = False

    if selected_keyword == "total":
        is_keyword_total = True
    else:
        is_keyword_total = False

    if selected_company == "total":
        is_company_total = True
    else:
        is_company_total = False

    return {
        "date": is_date_total,
        "keyword": is_keyword_total,
        "company": is_company_total
    }


@apis.route('/api/statistics', methods=["GET"])
def statistics():
    selected_date = request.args.get("date")
    selected_keyword = request.args.get("keyword")
    selected_company = request.args.get("company")

    is_total = is_total_selected(selected_date, selected_keyword, selected_company)

    if is_total["date"]:
        if is_total["keyword"]:
            if is_total["company"]:
                return jsonify(cp2.date_total_keyword_total_company_total())
            else:
                return jsonify(cp2.date_total_keyword_total_company_specific(selected_company))
        else:
            if is_total["company"]:
                return jsonify(cp2.date_total_keyword_specific_company_total(selected_keyword))
            else:
                return jsonify(cp2.date_total_keyword_specific_company_specific(selected_keyword, selected_company))
    else:
        if is_total["keyword"]:
            if is_total["company"]:
                return jsonify(cp2.date_specific_keyword_total_company_total(selected_date))
            else:
                return jsonify(cp2.date_specific_keyword_total_company_specific(selected_date, selected_company))
        else:
            if is_total["company"]:
                return jsonify(cp2.date_specific_keyword_specific_company_total(selected_date, selected_keyword))
            else:
                return jsonify(cp2.date_specific_keyword_specific_company_specific(selected_date, selected_keyword, selected_company))



@apis.route('/api/newses', methods=["GET"])
def news_list():
    selected_date = request.args.get("date")
    selected_keyword = request.args.get("keyword")
    selected_company = request.args.get("company")

    is_total = is_total_selected(selected_date, selected_keyword, selected_company)

    if is_total["date"]:
        if is_total["keyword"]:
            if is_total["company"]:
                return jsonify(cn.date_total_keyword_total_company_total())
            else:
                return jsonify(cn.date_total_keyword_total_company_specific(selected_company))
        else:
            if is_total["company"]:
                return jsonify(cn.date_total_keyword_specific_company_total(selected_keyword))
            else:
                return jsonify(cn.date_total_keyword_specific_company_specific(selected_keyword, selected_company))
    else:
        if is_total["keyword"]:
            if is_total["company"]:
                return jsonify(cn.date_specific_keyword_total_company_total(selected_date))
            else:
                return jsonify(cn.date_specific_keyword_total_company_specific(selected_date, selected_company))
        else:
            if is_total["company"]:
                return jsonify(cn.date_specific_keyword_specific_company_total(selected_date, selected_keyword))
            else:
                return jsonify(cn.date_specific_keyword_specific_company_specific(selected_date, selected_keyword, selected_company))

@apis.route('/api/selectors', methods=["GET"])
def selectors():
    selectors = gs2.getSelectors()
    result = {}
    for key in selectors.keys():
        temp = []
        for selector, count in selectors[key]:
            temp.append(selector)
        result[key] = temp
    return jsonify(result)

@apis.route('/api/line_graph', methods=["GET"])
def line_graph():
    month = int(request.args.get("month"))

    return jsonify(gl.getLineGraphData(month))

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



