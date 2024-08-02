from flask import Flask, jsonify, send_from_directory
import os
import random

app = Flask(__name__)

EMOJI_FOLDER = 'all_emojis'


@app.route('/')
def serve_html():
    return send_from_directory('.', 'index.html')


@app.route('/api/random-emoji')
def random_emoji():
    emoji_files = [f for f in os.listdir(EMOJI_FOLDER) if f.endswith('.svg')]
    correct_emoji = random.choice(emoji_files)

    with open(os.path.join(EMOJI_FOLDER, correct_emoji), 'r') as file:
        svg_content = file.read()

    # Generate options (including the correct answer)
    options = random.sample(emoji_files, min(4, len(emoji_files)))
    if correct_emoji not in options:
        options[-1] = correct_emoji
    random.shuffle(options)

    return jsonify({
        'correct_answer': correct_emoji,
        'options': options,
        'svg': svg_content
    })


if __name__ == '__main__':
    app.run(debug=True)
