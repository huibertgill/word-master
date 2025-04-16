from flask import Flask, send_from_directory, request, jsonify
import os
import requests

# Laden der Umgebungsvariablen aus der .env-Datei
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

@app.route('/')
def serve_index():
    return send_from_directory('../', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../', path)

@app.route('/unsplash')
def unsplash_proxy():
    access_key = os.getenv('UNSPLASH_ACCESS_KEY')
    query = request.args.get('query')
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400
    
    url = f'https://api.unsplash.com/search/photos?client_id={access_key}&query={query}'
    response = requests.get(url)
    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch data from Unsplash'}), response.status_code

# Neue Route für den AI-Chat
@app.route('/ai_chat', methods=['POST'])
def ai_chat():
    data = request.json
    user_input = data.get('user_input')
    image_info = data.get('image_info')

    # Laden des OpenAI-API-Schlüssels aus der .env-Datei
    openai_api_key = os.getenv('OPENAI_API_KEY')
    openai_url = os.getenv('OPENAI_URL')

    # Erstellung des Prompts für die KI
    with open('./backend/ai_prompt.txt', 'r') as file:
     prompt_template = file.read()
     prompt = prompt_template.format(image_info=image_info, user_input=user_input)

    # Anfrage an die OpenAI-API
    headers = {'Authorization': f'Bearer {openai_api_key}', 'Content-Type': 'application/json'}
    openai_model = os.getenv('OPENAI_MODELL')
    payload = {'model': openai_model, 'messages': [{'role': 'user', 'content': prompt}]}
    response = requests.post(openai_url, headers=headers, json=payload)

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch response from OpenAI'}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)