import dataclasses
from flask import Flask, Response
from flask import request
import os
import openai  
import json 
from keybert import KeyBERT

api = Flask(__name__)

@api.route('/chatgpt', methods=['POST'])
def getcorrection():
    # get data from body and store in data vairable
    data = request.get_json()
    
    bullet = data['bullet']
    
    checked = data['checked']
    instructions = "Add the following words: "
    for word in checked:
        instructions += word + ", "
        
    openai.api_key = "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"
    res = openai.Edit.create(
      model="text-davinci-edit-001",
      input=bullet,
      instruction=instructions
    )
        
    resp = Response()
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    resp.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    resp.headers['Content-Type'] = 'application/json'
    resp.data = json.dumps(res)
    return resp
@api.route('/keyword', methods=['POST'])
def keyword():
  doc = request.get_json()["inputinfo"]
  print(doc)
  #doc = "We are seeking a dedicated Postdoctoral Appointee to lead and support the development of novel solutions for robotic, electromechanical, uncrewed and/or autonomous systems for projects in a fast-paced team environment! The selected candidate will span the breadth of R&D from basic research to applied development with operational result requirements."
  kw_model = KeyBERT()
  keywords = kw_model.extract_keywords(doc)
  print(kw_model.extract_keywords(doc, keyphrase_ngram_range=(1, 1), stop_words=None))
  resp = Response()
  resp.headers['Access-Control-Allow-Origin'] = '*'
  resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
  resp.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
  resp.headers['Content-Type'] = 'application/json'
  resp.data = json.dumps(keywords)
  return resp


   
    