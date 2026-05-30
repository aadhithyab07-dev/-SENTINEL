from flask import Flask, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

@app.route('/osint/ip/<ip>', methods=['GET'])
def lookup_ip(ip):
    try:
        res = requests.get(f'http://ip-api.com/json/{ip}', timeout=5)
        data = res.json()
        return jsonify({
            'ip': ip,
            'country': data.get('country', 'Unknown'),
            'city': data.get('city', 'Unknown'),
            'isp': data.get('isp', 'Unknown'),
            'org': data.get('org', 'Unknown'),
            'region': data.get('regionName', 'Unknown'),
            'status': data.get('status', 'Unknown'),
            'lat': data.get('lat', 0),
            'lon': data.get('lon', 0),
        })
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(port=5002, debug=True)