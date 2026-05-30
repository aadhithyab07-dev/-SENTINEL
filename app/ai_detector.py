from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

def analyze_traffic(data):
    alerts = []
    risk_score = 0

    if data.get('ports_scanned', 0) > 10:
        alerts.append({'type': 'PORT SCAN', 'severity': 'HIGH', 'description': f"Multiple ports scanned: {data['ports_scanned']}", 'color': '#ff4444'})
        risk_score += 40

    if data.get('failed_logins', 0) > 5:
        alerts.append({'type': 'BRUTE FORCE', 'severity': 'CRITICAL', 'description': f"Failed login attempts: {data['failed_logins']}", 'color': '#ff0000'})
        risk_score += 50

    if data.get('packet_size', 0) > 9000:
        alerts.append({'type': 'UNUSUAL TRAFFIC', 'severity': 'MEDIUM', 'description': f"Abnormal packet size: {data['packet_size']} bytes", 'color': '#ffaa00'})
        risk_score += 20

    if data.get('foreign_connections', 0) > 3:
        alerts.append({'type': 'SUSPICIOUS CONNECTIONS', 'severity': 'HIGH', 'description': f"Foreign connections: {data['foreign_connections']}", 'color': '#ff4444'})
        risk_score += 30

    if risk_score >= 70:
        threat_level, threat_color = 'CRITICAL', '#ff0000'
    elif risk_score >= 40:
        threat_level, threat_color = 'HIGH', '#ff4444'
    elif risk_score >= 20:
        threat_level, threat_color = 'MEDIUM', '#ffaa00'
    else:
        threat_level, threat_color = 'LOW', '#00ff88'

    return {'risk_score': min(risk_score, 100), 'threat_level': threat_level, 'threat_color': threat_color, 'alerts': alerts, 'total_alerts': len(alerts)}

@app.route('/ai/analyze', methods=['POST'])
def analyze():
    data = request.json
    return jsonify(analyze_traffic(data))

@app.route('/ai/simulate', methods=['GET'])
def simulate():
    scenario = random.choice([
        {'ports_scanned': 15, 'failed_logins': 8, 'packet_size': 1500, 'foreign_connections': 1},
        {'ports_scanned': 2, 'failed_logins': 0, 'packet_size': 10000, 'foreign_connections': 5},
        {'ports_scanned': 20, 'failed_logins': 10, 'packet_size': 9500, 'foreign_connections': 6},
        {'ports_scanned': 1, 'failed_logins': 0, 'packet_size': 500, 'foreign_connections': 0},
    ])
    result = analyze_traffic(scenario)
    result['input'] = scenario
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5003, debug=True)