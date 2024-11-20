import os
from flask import Flask, render_template, jsonify, request, send_file
from news_summarizer import fetch_rss_feeds, summarize_with_openai, save_report
from datetime import datetime

app = Flask(__name__)

RSS_LINKS_FILE = 'rss_links.txt'

def read_rss_links():
    try:
        with open(RSS_LINKS_FILE, 'r') as file:
            return [line.strip() for line in file if line.strip()]
    except FileNotFoundError:
        return []

def write_rss_links(links):
    with open(RSS_LINKS_FILE, 'w') as file:
        for link in links:
            file.write(f"{link}\n")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/options')
def options():
    return render_template('options.html')

@app.route('/api/rss-links', methods=['GET', 'POST'])
def rss_links():
    if request.method == 'GET':
        links = read_rss_links()
        return jsonify({'links': links})
    
    elif request.method == 'POST':
        try:
            links = request.json.get('links', [])
            # Basic validation
            valid_links = []
            for link in links:
                link = link.strip()
                if link and (link.startswith('http://') or link.startswith('https://')):
                    valid_links.append(link)
            
            write_rss_links(valid_links)
            return jsonify({'status': 'success'})
        except Exception as e:
            return jsonify({
                'status': 'error',
                'message': str(e)
            }), 400

@app.route('/generate_summary', methods=['POST'])
def generate_summary():
    try:
        # Fetch articles
        articles = fetch_rss_feeds()
        
        # Generate summary
        summary = summarize_with_openai(articles)
        
        # Save report
        save_report(summary)
        
        return jsonify({
            'status': 'success',
            'summary': summary,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True) 