from http.server import BaseHTTPRequestHandler
import json
import os


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status_code: int, payload_bytes: bytes) -> None:
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        self.wfile.write(payload_bytes)

    def do_GET(self):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        path = self.path.split('?')[0].rstrip('/')

        if path.endswith('/system') or path.endswith('/system_stats'):
            target_file = 'system_stats.json'
        elif path.endswith('/github') or path.endswith('/github_response'):
            target_file = 'github_response.json'
        elif path.endswith('/stats') or path.endswith('/stats_summary'):
            target_file = 'stats_summary.json'
        elif path == '' or path == '/' or path.endswith('/health'):
            response_payload = {
                "service": "api",
                "status": "healthy",
                "endpoints": [
                    "/stats",
                    "/system",
                    "/github",
                ],
            }
            self._send_json(200, json.dumps(response_payload, indent=2).encode('utf-8'))
            return
        else:
            not_found = {"error": f"Unknown endpoint: {path}", "service": "api"}
            self._send_json(404, json.dumps(not_found).encode('utf-8'))
            return

        file_path = os.path.join(current_dir, target_file)
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    self._send_json(200, f.read().encode('utf-8'))
            except OSError as exc:
                err_payload = {"error": str(exc), "service": "api"}
                self._send_json(500, json.dumps(err_payload).encode('utf-8'))
        else:
            fallback = {"error": f"{target_file} not found", "service": "api"}
            self._send_json(404, json.dumps(fallback).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
