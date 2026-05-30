from flask import Flask, jsonify, request
from flask_cors import CORS
import socket
import struct
import threading
import requests
import hashlib
import os
import random
import time

app = Flask(__name__)
CORS(app, origins="*", allow_headers="*", methods=["GET", "POST", "OPTIONS"])

# ── NETWORK SCANNER ──────────────────────────────────────
@app.route('/scan', methods=['GET'])
def scan_network():
    try:
        import nmap
        def get_local_ip():
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            s.close()
            return ip
        local_ip = get_local_ip()
        network = local_ip.rsplit('.', 1)[0] + '.0/24'
        nm = nmap.PortScanner()
        nm.scan(hosts=network, arguments='-sn')
        devices = []
        for host in nm.all_hosts():
            devices.append({'ip': host, 'status': nm[host].state(), 'hostname': nm[host].hostname()})
        return jsonify({'network': network, 'devices': devices})
    except Exception as e:
        return jsonify({'error': str(e)})

# ── FORENSICS ────────────────────────────────────────────
baseline = {}

def get_file_hash(filepath):
    try:
        with open(filepath, 'rb') as f:
            return hashlib.sha256(f.read()).hexdigest()
    except:
        return None

def scan_directory(path):
    files = {}
    for root, dirs, filenames in os.walk(path):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '__pycache__']]
        for filename in filenames:
            full_path = os.path.join(root, filename)
            try:
                stat = os.stat(full_path)
                files[full_path] = {'hash': get_file_hash(full_path), 'size': stat.st_size}
            except:
                continue
    return files

@app.route('/forensics/baseline', methods=['POST'])
def take_baseline():
    global baseline
    path = request.json.get('path', '.')
    baseline = scan_directory(path)
    return jsonify({'message': 'Baseline captured!', 'total_files': len(baseline)})

@app.route('/forensics/scan', methods=['POST'])
def detect_changes():
    global baseline
    if not baseline:
        return jsonify({'error': 'Take baseline first!'})
    path = request.json.get('path', '.')
    current = scan_directory(path)
    new_files = [f for f in current if f not in baseline]
    modified = [f for f in current if f in baseline and current[f]['hash'] != baseline[f]['hash']]
    deleted = [f for f in baseline if f not in current]
    return jsonify({'new_files': new_files[:20], 'modified': modified[:20], 'deleted': deleted[:20],
                    'total_new': len(new_files), 'total_modified': len(modified), 'total_deleted': len(deleted)})

# ── OSINT ────────────────────────────────────────────────
@app.route('/osint/ip/<ip>', methods=['GET'])
def lookup_ip(ip):
    try:
        res = requests.get(f'http://ip-api.com/json/{ip}', timeout=5)
        data = res.json()
        return jsonify({'ip': ip, 'country': data.get('country', 'Unknown'),
                        'city': data.get('city', 'Unknown'), 'isp': data.get('isp', 'Unknown'),
                        'org': data.get('org', 'Unknown'), 'region': data.get('regionName', 'Unknown'),
                        'status': data.get('status', 'Unknown')})
    except Exception as e:
        return jsonify({'error': str(e)})

# ── AI DETECTOR ──────────────────────────────────────────
def analyze_traffic(data):
    alerts = []
    risk_score = 0
    if data.get('ports_scanned', 0) > 10:
        alerts.append({'type': 'PORT SCAN', 'severity': 'HIGH', 'description': f"Ports scanned: {data['ports_scanned']}", 'color': '#ff4444'})
        risk_score += 40
    if data.get('failed_logins', 0) > 5:
        alerts.append({'type': 'BRUTE FORCE', 'severity': 'CRITICAL', 'description': f"Failed logins: {data['failed_logins']}", 'color': '#ff0000'})
        risk_score += 50
    if data.get('packet_size', 0) > 9000:
        alerts.append({'type': 'UNUSUAL TRAFFIC', 'severity': 'MEDIUM', 'description': f"Packet size: {data['packet_size']} bytes", 'color': '#ffaa00'})
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
    return {'risk_score': min(risk_score, 100), 'threat_level': threat_level,
            'threat_color': threat_color, 'alerts': alerts, 'total_alerts': len(alerts)}

@app.route('/ai/analyze', methods=['POST'])
def analyze():
    return jsonify(analyze_traffic(request.json))

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

@app.route('/', methods=['GET'])
def health():
    return jsonify({'status': 'SENTINEL Backend Running!', 'version': '1.0'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=False)