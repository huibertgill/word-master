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
    prompt = f"Du bist ein English Tutor. Das Spiel heißt: Schreibe das Wort anhand eines Bildes. Das gesuchte Wort lautet: {image_info['word']}. Der Teilnehmer hat nicht das richtige Wort eingegeben, sondern: {user_input}. Weitere Hinweise zum Bild sind: - Bild Titel von Unsplash: {image_info['title']} - Description von Unsplash: {image_info['description']} - Alt_Description von Unsplash: {image_info['alt_description']}. Gebe einen Hinweis, ohne das Wort direkt zu verraten. Sprich Englisch, wechele ggf. auf Deutsch, wenn du meinst, der Teilnehmer hat Probleme."

    # Anfrage an die OpenAI-API
    headers = {'Authorization': f'Bearer {openai_api_key}', 'Content-Type': 'application/json'}
    payload = {'model': 'gpt-3.5-turbo', 'messages': [{'role': 'user', 'content': prompt}]}
    response = requests.post(openai_url, headers=headers, json=payload)

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch response from OpenAI'}), response.status_code

if __name__ == '__main__':
    app.run(debug=True)