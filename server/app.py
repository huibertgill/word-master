from flask import Flask, send_from_directory, request, jsonify
import os
import requests

# Laden der Umgebungsvariablen aus der .env-Datei
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)

@app.route('/')
def serve_index():
    return send_from_directory('static/', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('static/', path)

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

# Route für ein zufälliges Wort
import random

@app.route('/random_word', methods=['GET'])
def random_word():
    words = []
    words_file_path = os.path.join(os.path.dirname(__file__), 'words.txt')
    try:
        if os.path.exists(words_file_path):
            with open(words_file_path, 'r', encoding='utf-8') as f:
                words = [line.strip() for line in f if line.strip()]
    except Exception:
        words = []

    # Fallback-Liste, falls Datei fehlt oder leer ist
    if not words:
        words = [
            "Island", "Yacht",
            "Scissors", "Pharmacy", "Neighbor", "Restaurant",
            "Knee", "Knife", "Ocean", "Banana", "Bicycle", "Giraffe",
            "Chocolate", "Breakfast", "Horse", "Dog"
        ]
    word = random.choice(words)
    return jsonify({"word": word})

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
    with open('./ai_prompt.txt', 'r') as file:
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