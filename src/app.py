from flask import Flask, render_template, request
from models import SuggestList
from apis import apis

app = Flask(__name__)
app.register_blueprint(apis)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/suggest", methods=["POST", "GET", "PATCH", "DELETE"])
def suggest():
    if request.method == "POST":
        return SuggestList().post_list()
    elif request.method == "GET":
        return SuggestList().get_list()
    elif request.method == "PATCH":
        return SuggestList().edit_list()
    elif request.method == "DELETE":
        return SuggestList().delete_list()



