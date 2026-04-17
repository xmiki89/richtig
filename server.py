#!/usr/bin/env python3
import os
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import datetime

class MemberHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/get-role'):
            parsed_path = urlparse(self.path)
            query = parse_qs(parsed_path.query)
            name = query.get('name', [''])[0]
            nachname = query.get('nachname', [''])[0]
            
            member_dir = r"C:\Users\micha\CascadeProjects\windsurf-project-2\member stuff"
            file_path = os.path.join(member_dir, f"{name} {nachname}.txt")
            
            if os.path.exists(file_path):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    lines = content.split('\n')
                    role_line = next((line for line in lines if line.startswith('Member:') or line.startswith('Rolle:')), None)
                    role = role_line.split(': ')[1] if role_line else 'Member'
                    
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'role': role}).encode('utf-8'))
                except Exception as e:
                    self.send_response(500)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'role': 'Member'}).encode('utf-8'))
            else:
                self.send_response(404)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'role': 'Member'}).encode('utf-8'))
        elif self.path.startswith('/check-member'):
            parsed_path = urlparse(self.path)
            query = parse_qs(parsed_path.query)
            name = query.get('name', [''])[0]
            nachname = query.get('nachname', [''])[0]
            
            member_dir = r"C:\Users\micha\CascadeProjects\windsurf-project-2\member stuff"
            file_path = os.path.join(member_dir, f"{name} {nachname}.txt")
            exists = os.path.exists(file_path)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'exists': exists}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_POST(self):
        if self.path == '/save-member':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            
            try:
                data = json.loads(post_data)
            except json.JSONDecodeError:
                data = {}
            
            name = data.get('name', 'Unknown')
            nachname = data.get('nachname', 'Unknown')
            email = data.get('email', '')
            member_id = data.get('id', '')
            
            # Create directory if it doesn't exist
            member_dir = r"C:\Users\micha\CascadeProjects\windsurf-project-2\member stuff"
            os.makedirs(member_dir, exist_ok=True)
            
            # Write to file
            file_path = os.path.join(member_dir, f"{name} {nachname}.txt")
            
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(f"Name: {name}\n")
                    f.write(f"Nachname: {nachname}\n")
                    f.write(f"Email: {email}\n")
                    f.write(f"ID: {member_id}\n")
                
                self.send_response(200)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'Success')
                print(f"Mitgliedsdaten gespeichert in {file_path}")
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(f'Error: {str(e)}'.encode('utf-8'))
                print(f"Fehler beim Speichern: {e}")
        elif self.path == '/update-role':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length).decode('utf-8')
            
            try:
                data = json.loads(post_data)
            except json.JSONDecodeError:
                data = {}
            
            name = data.get('name', 'Unknown')
            nachname = data.get('nachname', 'Unknown')
            role = data.get('role', 'Member')
            
            # File path
            member_dir = r"C:\Users\micha\CascadeProjects\windsurf-project-2\member stuff"
            file_path = os.path.join(member_dir, f"{name} {nachname}.txt")
            
            if os.path.exists(file_path):
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    lines = content.split('\n')
                    # Remove existing role line
                    lines = [line for line in lines if not (line.startswith('Member:') or line.startswith('Rolle:'))]
                    # Add new role
                    lines.append(f'Member: {role}')
                    
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write('\n'.join(lines))
                    
                    self.send_response(200)
                    self.send_header('Content-type', 'text/plain')
                    self.end_headers()
                    self.wfile.write(b'Role updated successfully')
                    print(f"Rolle für {name} {nachname} aktualisiert: {role}")
                    
                except Exception as e:
                    self.send_response(500)
                    self.send_header('Content-type', 'text/plain')
                    self.end_headers()
                    self.wfile.write(f'Error: {str(e)}'.encode('utf-8'))
                    print(f"Fehler beim Aktualisieren der Rolle: {e}")
            else:
                self.send_response(404)
                self.send_header('Content-type', 'text/plain')
                self.end_headers()
                self.wfile.write(b'Member file not found')
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_GET(self):
        # Serve static files
        if self.path == '/':
            self.path = '/index.html'
        
        try:
            with open(self.path[1:], 'rb') as f:
                self.send_response(200)
                if self.path.endswith('.css'):
                    self.send_header('Content-type', 'text/css')
                elif self.path.endswith('.js'):
                    self.send_header('Content-type', 'application/javascript')
                else:
                    self.send_header('Content-type', 'text/html')
                self.end_headers()
                self.wfile.write(f.read())
        except FileNotFoundError:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, format, *args):
        # Suppress default logging
        pass

if __name__ == '__main__':
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, MemberHandler)
    print("Server läuft auf http://localhost:8000")
    print("Mitgliedsdaten werden in 'member stuff/members.txt' gespeichert")
    httpd.serve_forever()
