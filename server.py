import http.server
import os
import socketserver

PORT = 8000

print(f'oregon-trail-flask server starting on port {PORT}')
http_server = socketserver.TCPServer(('', PORT), http.server.SimpleHTTPRequestHandler)
http_server.serve_forever()
