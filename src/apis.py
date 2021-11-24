import pymongo
from flask import Blueprint, jsonify, request
import concatParts as cp
import concatNewses as cn
import getSelectors as gs

apis = Blueprint(__name__, 'apis')

def getParams():
    selected_date = request.args.get("date")
    selected_keyword = request.args.get("keyword")
    selected_company = request.args.get("company")

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
        "is_total": (is_date_total, is_keyword_total, is_company_total),
        "params": (selected_date, selected_keyword, selected_company)
    }


@apis.route('/api/statistics', methods=["GET"])
def statistics():
    requested = getParams()
    is_total = "is_total"
    params = "params"

    if requested[is_total][0]:
        if requested[is_total][1]:
            if requested[is_total][2]:
                return jsonify(cp.date_total_keyword_total_company_total())
            else:
                return jsonify(cp.date_total_keyword_total_company_specific(requested[params][2]))
        else:
            if requested[is_total][2]:
                return jsonify(cp.date_total_keyword_specific_company_total(requested[params][1]))
            else:
                return jsonify(cp.date_total_keyword_specific_company_specific(requested[params][1], requested[params][2]))
    else:
        if requested[is_total][1]:
            if requested[is_total][2]:
                return jsonify(cp.date_specific_keyword_total_company_total(requested[params][0]))
            else:
                return jsonify(cp.date_specific_keyword_total_company_specific(requested[params][0], requested[params][2]))
        else:
            if requested[is_total][2]:
                return jsonify(cp.date_specific_keyword_specific_company_total(requested[params][0], requested[params][1]))
            else:
                return jsonify(cp.date_specific_keyword_specific_company_specific(requested[params][0], requested[params][1], requested[params][2]))



@apis.route('/api/newses', methods=["GET"])
def news_list():
    requested = getParams()
    is_total = "is_total"
    params = "params"

    if requested[is_total][0]:
        if requested[is_total][1]:
            if requested[is_total][2]:
                return jsonify(cn.date_total_keyword_total_company_total())
            else:
                return jsonify(cn.date_total_keyword_total_company_specific(requested[params][2]))
        else:
            if requested[is_total][2]:
                return jsonify(cn.date_total_keyword_specific_company_total(requested[params][1]))
            else:
                return jsonify(cn.date_total_keyword_specific_company_specific(requested[params][1], requested[params][2]))
    else:
        if requested[is_total][1]:
            if requested[is_total][2]:
                return jsonify(cn.date_specific_keyword_total_company_total(requested[params][0]))
            else:
                return jsonify(cn.date_specific_keyword_total_company_specific(requested[params][0], requested[params][2]))
        else:
            if requested[is_total][2]:
                return jsonify(cn.date_specific_keyword_specific_company_total(requested[params][0], requested[params][1]))
            else:
                return jsonify(cn.date_specific_keyword_specific_company_specific(requested[params][0], requested[params][1], requested[params][2]))

@apis.route('/api/selectors', methods=["GET"])
def selectors():
    selectors = gs.getSelectors()
    result = {}
    for key in selectors.keys():
        temp = []
        for selector in selectors[key].keys():
            temp.append(selector)
        result[key] = temp
    return jsonify(result)


