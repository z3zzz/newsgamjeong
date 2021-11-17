from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client.get_database('gamjeong')

suggest_list = db.get_collection('suggest_list')
project_link_list = db.get_collection('project_link_list')
extra_list = db.get_collection('extra_list')
