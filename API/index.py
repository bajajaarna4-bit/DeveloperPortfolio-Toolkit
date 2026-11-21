from http.server import BaseHTTPRequestHandler
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        current_dir = os.path.dirname(os.path.abspath(__file__))
        path = self.path.split('?')[0].rstrip('/')
        
        if path.endswith('/system') or path.endswith('/system_stats'):
            target_file = 'system_stats.json'
        elif path.endswith('/github') or path.endswith('/github_response'):
            target_file = 'github_response.json'
        elif path.endswith('/stats') or path.endswith('/stats_summary'):
            target_file = 'stats_summary.json'
        else:
            # Root health check / index
            response_payload = {
                "service": "api",
                "status": "healthy",
                "endpoints": [
                    "/stats",
                    "/system",
                    "/github"
                ]
            }
            self.wfile.write(json.dumps(response_payload, indent=2).encode('utf-8'))
            return

        file_path = os.path.join(current_dir, target_file)
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                self.wfile.write(f.read().encode('utf-8'))
        else:
            fallback = {"error": f"{target_file} not found", "service": "api"}
            self.wfile.write(json.dumps(fallback).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
