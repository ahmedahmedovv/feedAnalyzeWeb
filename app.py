from flask import Flask, render_template, jsonify, request
from news_summarizer import fetch_rss_feeds, summarize_with_openai, save_report
from datetime import datetime

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

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