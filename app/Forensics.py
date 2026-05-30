import os
import hashlib
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

def get_file_hash(filepath):
    try:
        with open(filepath, 'rb') as f:
            return hashlib.sha256(f.read()).hexdigest()
    except:
        return None

def scan_directory(path):
    files = {}
    for root, dirs, filenames in os.walk(path):
        # skip system folders
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '__pycache__']]
        for filename in filenames:
            full_path = os.path.join(root, filename)
            try:
                stat = os.stat(full_path)
                files[full_path] = {
                    'hash': get_file_hash(full_path),
                    'size': stat.st_size,
                    'modified': stat.st_mtime
                }
            except:
                continue
    return files

baseline = {}

@app.route('/forensics/baseline', methods=['POST'])
def take_baseline():
    global baseline
    path = request.json.get('path', 'C:\\Users')
    baseline = scan_directory(path)
    return jsonify({
        'message': 'Baseline captured!',
        'total_files': len(baseline)
    })

@app.route('/forensics/scan', methods=['POST'])
def detect_changes():
    global baseline
    if not baseline:
        return jsonify({'error': 'Take baseline first!'})
    
    path = request.json.get('path', 'C:\\Users')
    current = scan_directory(path)
    
    new_files = []
    modified = []
    deleted = []

    for f, info in current.items():
        if f not in baseline:
            new_files.append(f)
        elif info['hash'] != baseline[f]['hash']:
            modified.append(f)

    for f in baseline:
        if f not in current:
            deleted.append(f)

    return jsonify({
        'new_files': new_files[:20],
        'modified': modified[:20],
        'deleted': deleted[:20],
        'total_new': len(new_files),
        'total_modified': len(modified),
        'total_deleted': len(deleted)
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)