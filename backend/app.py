from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)
API_URL = "https://eu-gb.ml.cloud.ibm.com/ml/v4/deployments/9c3a9ffe-712a-481c-95a4-6424207ecc56/ai_service_stream?version=2021-05-01"

API_KEY = os.getenv("IBM_API_KEY")

def get_iam_token():
    url = "https://iam.cloud.ibm.com/identity/token"
    headers = { "Content-Type": "application/x-www-form-urlencoded" }
    data = {
        "grant_type": "urn:ibm:params:oauth:grant-type:apikey",
        "apikey": API_KEY
    }
    response = requests.post(url, headers=headers, data=data)
    return response.json().get("access_token")

def call_ibm_nutrition_agent(query):
    token = get_iam_token()
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    payload = {
        "input": query
    }

    res = requests.post(API_URL, headers=headers, json=payload)
    print("🔍 IBM Response JSON:", res.json())
    try:
        return res.json().get("result", "No result found.")
    except:
        return " Error in IBM response"

@app.route("/nutrition", methods=["POST"])
def get_nutrition():
    data = request.get_json()
    query = data.get("query", "")
    result = call_ibm_nutrition_agent(query)
    return jsonify({ "result": result })

@app.route('/image-nutrition', methods=['POST'])
def image_nutrition():
    file = request.files['image']
    return jsonify({
        'result': "🧠 Image processed. Nutrition: 200 kcal, 5g protein. (Demo)"
    })

if __name__ == '__main__':
    app.run(debug=True)
