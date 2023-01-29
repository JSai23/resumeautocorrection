import dataclasses
from flask import Flask, Response
from flask import request
import os
import openai  
import json 

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

   
    