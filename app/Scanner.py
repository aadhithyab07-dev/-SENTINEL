import nmap
import socket
import json
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip = s.getsockname()[0]
    s.close()
    return ip

@app.route('/scan', methods=['GET'])
def scan_network():
    local_ip = get_local_ip()
    network = local_ip.rsplit('.', 1)[0] + '.0/24'
    
    nm = nmap.PortScanner()
    nm.scan(hosts=network, arguments='-sn')
    
    devices = []
    for host in nm.all_hosts():
        devices.append({
            'ip': host,
            'status': nm[host].state(),
            'hostname': nm[host].hostname()
        })
    
    return jsonify({'network': network, 'devices': devices})

@app.route('/portscan/<ip>', methods=['GET'])
def port_scan(ip):
    nm = nmap.PortScanner()
    nm.scan(ip, '1-1024')
    
    open_ports = []
    for port in nm[ip]['tcp']:
        if nm[ip]['tcp'][port]['state'] == 'open':
            open_ports.append(port)
    
    return jsonify({'ip': ip, 'open_ports': open_ports})

if __name__ == '__main__':
    app.run(port=5000, debug=True)