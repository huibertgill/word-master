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
        data = response.json()
        results = data.get('results', [])
        if not results:
            return jsonify({'error': 'No images found for the given query'}), 404
        import random
        random_image = random.choice(results)
        return jsonify(random_image)
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
    chat_history = data.get('chat_history', [])
    guessed_words = data.get('guessed_words', [])
    fail_count = data.get('fail_count', 0)

    # Laden des OpenAI-API-Schlüssels aus der .env-Datei
    openai_api_key = os.getenv('OPENAI_API_KEY')
    openai_url = os.getenv('OPENAI_URL')

    # Prompt-Auswahl basierend auf Fehlerzähler
    prompt_file = f'./ai_prompt_{fail_count}.txt'
    try:
        with open(prompt_file, 'r', encoding='utf-8') as file:
            prompt_template = file.read()
    except FileNotFoundError:
        # Fallback to a default prompt if the specific one is not found
        with open('./ai_prompt.txt', 'r', encoding='utf-8') as file:
            prompt_template = file.read()

    # Formatierung des Gesprächsverlaufs für den Prompt
    formatted_chat_history = "\n".join([f"{msg['role']}: {msg['content']}" for msg in chat_history])

    # Formatierung der geratenen Wörter für den Prompt
    formatted_guessed_words = ", ".join([f"WORT_{i+1}: {word}" for i, word in enumerate(guessed_words)])

    # Erstellung des Prompts für die KI
    prompt = prompt_template.format(
        image_info=image_info,
        user_input=user_input,
        chat_history=formatted_chat_history,
        guessed_words=formatted_guessed_words
    )

    # Anfrage an die OpenAI-API
    headers = {'Authorization': f'Bearer {openai_api_key}', 'Content-Type': 'application/json'}
    openai_model = os.getenv('OPENAI_MODELL')
    # Senden des Gesprächsverlaufs als separate Nachrichten im Payload
    messages = [{'role': msg['role'], 'content': msg['content']} for msg in chat_history]
    messages.append({'role': 'user', 'content': prompt}) # Füge den aktuellen Prompt als letzte Benutzernachricht hinzu

    payload = {'model': openai_model, 'messages': messages}
    response = requests.post(openai_url, headers=headers, json=payload)

    if response.status_code == 200:
        return jsonify(response.json())
    else:
        return jsonify({'error': 'Failed to fetch response from OpenAI'}), response.status_code

@app.route('/describe', methods=['POST'])
def describe_image_v2():
    data = request.json
    image_url = data.get('image_url')
    if not image_url:
        return jsonify({'error': 'image_url is required'}), 400

    # Laden des OpenAI-Konfigurations
    openai_api_key = os.getenv('OPENAI_API_KEY')
    openai_url = os.getenv('OPENAI_URL')
    openai_model = os.getenv('OPENAI_MODELL')
    if not openai_api_key or not openai_url or not openai_model:
        return jsonify({'error': 'OpenAI configuration is missing'}), 500

    # Fetch image bytes
    try:
        img_resp = requests.get(image_url)
        img_resp.raise_for_status()
    except Exception:
        return jsonify({'error': 'Failed to fetch image from URL'}), 500

    # Build messages payload with direct image URL (multimodal)
    headers = {
        'Authorization': f'Bearer {openai_api_key}',
        'Content-Type': 'application/json'
    }
    payload = {
        'model': openai_model,
        'messages': [
            {
                'role': 'user',
                'content': [
                    {'type': 'text', 'text': 'Please provide a concise English description of the image.'},
                    {'type': 'image_url', 'image_url': {'url': image_url}}
                ]
            }
        ]
    }
    # Send request to Chat Completions endpoint with retries on 429
    import time
    max_retries = 2
    for attempt in range(max_retries + 1):
        print ('call openAI: ' )
        response = requests.post(openai_url, headers=headers, json=payload)
        if response.status_code == 429 and attempt < max_retries:
            retry_after = int(response.headers.get('Retry-After', '1'))
            time.sleep(retry_after)
            continue
        break
    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch description from OpenAI'}), response.status_code

    res_json = response.json()
    try:
        desc_text = res_json['choices'][0]['message']['content']
    except (KeyError, IndexError):
        return jsonify({'error': 'Invalid response from OpenAI'}), 500
    return jsonify({'description': desc_text})

if __name__ == '__main__':
    app.run(
    host='127.0.0.1',
    debug=True
)