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

if __name__ == '__main__':
    app.run(debug=True)