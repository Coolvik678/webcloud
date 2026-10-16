import os, sys, urllib.parse, mimetypes, socket
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler

PORT = 8085
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

mimetypes.init()
mimetypes.add_type('font/woff2', '.woff2')
mimetypes.add_type('font/woff', '.woff')
mimetypes.add_type('image/webp', '.webp')
mimetypes.add_type('image/svg+xml', '.svg')
mimetypes.add_type('video/mp4', '.mp4')
mimetypes.add_type('application/manifest+json', '.webmanifest')
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('text/css', '.css')

class MeticHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > 0:
            _ = self.rfile.read(content_length)

        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip('/')
        rel = path.lstrip('/')
        local_path = os.path.join(BASE_DIR, rel.replace('/', os.sep))
        idx = os.path.join(local_path, "index.html") if os.path.isdir(local_path) else None

        if idx and os.path.isfile(idx):
            self.serve_file(idx)
        elif os.path.isfile(local_path + ".html"):
            self.serve_file(local_path + ".html")
        else:
            self.serve_file(os.path.join(BASE_DIR, "index.html"))

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/_client_error":
            query = urllib.parse.parse_qs(parsed.query)
            msg = query.get('msg', ['unknown'])[0]
            with open(os.path.join(BASE_DIR, "client_error.txt"), "a", encoding="utf-8") as ef:
                ef.write(msg + "\n" + "="*50 + "\n")
            print(f"\n[CLIENT CRASH LOGGED]:\n{msg}\n")
            sys.stdout.flush()
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"ok")
            return

        # Next.js Image Optimizer: /_next/image?url=...
        if path == "/_next/image":
            query = urllib.parse.parse_qs(parsed.query)
            target_url = query.get('url', [''])[0]
            if target_url:
                target_rel = target_url.lstrip('/')
                local_file = os.path.join(BASE_DIR, target_rel.replace('/', os.sep))
                if os.path.exists(local_file) and os.path.isfile(local_file):
                    self.serve_file(local_file)
                    return
            self.send_error(404, "Image not found")
            return

        # Root route '/' -> serve en/index.html or index.html
        if path == "/" or path == "":
            self.serve_file(os.path.join(BASE_DIR, "index.html"))
            return

        # Direct file or directory resolution
        rel = path.lstrip('/')
        local_path = os.path.join(BASE_DIR, rel.replace('/', os.sep))

        if os.path.isfile(local_path):
            self.serve_file(local_path)
            return

        if os.path.isdir(local_path):
            idx = os.path.join(local_path, "index.html")
            if os.path.isfile(idx):
                self.serve_file(idx)
                return

        if os.path.isfile(local_path + ".html"):
            self.serve_file(local_path + ".html")
            return

        return super().do_GET()

    def serve_file(self, filepath):
        try:
            mime, _ = mimetypes.guess_type(filepath)
            if not mime:
                mime = 'application/octet-stream'

            size = os.path.getsize(filepath)
            self.send_response(200)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Length", str(size))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")
            self.send_header("Vary", "RSC, Next-Router-State-Tree, Next-Router-Prefetch")
            self.end_headers()

            with open(filepath, "rb") as f:
                while chunk := f.read(64 * 1024):
                    self.wfile.write(chunk)
            self.wfile.flush()
        except Exception:
            pass

    def log_message(self, format, *args):
        sys.stderr.write(f"[{self.log_date_time_string()}] {args[0]} {args[1]}\n")

if __name__ == '__main__':
    ThreadingHTTPServer.daemon_threads = True
    server_address = ('0.0.0.0', PORT)
    httpd = ThreadingHTTPServer(server_address, MeticHandler)
    print(f">> WebCloud High-Performance Threaded Server running at http://127.0.0.1:{PORT}/")
    print(f"   English version: http://127.0.0.1:{PORT}/en and http://localhost:{PORT}/en")
    sys.stdout.flush()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
