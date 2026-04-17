const http = require('http');
const fs = require('fs');
const path = require('path');

// Mock data for testing
let members = [
    { name: 'John', nachname: 'Doe', email: 'john@example.com', id: '123', password: 'test123', role: 'Member' }
];
let contracts = [];
let passwords = [];

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    if (req.method === 'GET' && req.url.startsWith('/check-member')) {
        const params = new URL(req.url, 'http://localhost').searchParams;
        const name = params.get('name') || '';
        const nachname = params.get('nachname') || '';
        
        const member = members.find(m => m.name === name && m.nachname === nachname);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ exists: !!member }));
        
    } else if (req.method === 'GET' && req.url.startsWith('/get-role')) {
        const params = new URL(req.url, 'http://localhost').searchParams;
        const name = params.get('name') || '';
        const nachname = params.get('nachname') || '';
        
        const member = members.find(m => m.name === name && m.nachname === nachname);
        const role = member?.role || 'Member';
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ role }));
        
    } else if (req.method === 'POST' && req.url === '/delete-member') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { name, nachname } = JSON.parse(body);
                members = members.filter(m => !(m.name === name && m.nachname === nachname));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'Deleted' }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error deleting member' }));
            }
        });
        
    } else if (req.method === 'POST' && req.url === '/save-vertrag') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const contract = JSON.parse(body);
                contract.createdAt = new Date();
                contracts.push(contract);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'OK' }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error saving contract' }));
            }
        });
        
    } else if (req.method === 'POST' && req.url === '/update-role') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { name, nachname, role } = JSON.parse(body);
                const member = members.find(m => m.name === name && m.nachname === nachname);
                if (member) {
                    member.role = role;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'Role updated successfully' }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error updating role' }));
            }
        });
        
    } else if (req.method === 'POST' && req.url === '/save-member') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const memberData = JSON.parse(body);
                memberData.role = 'Member';
                memberData.createdAt = new Date();
                
                const existingIndex = members.findIndex(m => m.name === memberData.name && m.nachname === memberData.nachname);
                if (existingIndex >= 0) {
                    members[existingIndex] = memberData;
                } else {
                    members.push(memberData);
                }
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'Member saved successfully' }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error saving member' }));
            }
        });
        
    } else if (req.method === 'POST' && req.url === '/save-password') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const passwordEntry = {
                    data: body,
                    createdAt: new Date()
                };
                passwords.push(passwordEntry);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'Password saved' }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error saving password' }));
            }
        });
        
    } else {
        // Serve static files
        let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
        const extname = path.extname(filePath);
        let contentType = 'text/html';
        
        switch (extname) {
            case '.js':
                contentType = 'text/javascript';
                break;
            case '.css':
                contentType = 'text/css';
                break;
        }
        
        fs.readFile(filePath, (error, content) => {
            if (error) {
                if (error.code === 'ENOENT') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    res.writeHead(500);
                    res.end('Server error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            }
        });
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Test Server running at http://localhost:${PORT}`);
    console.log('Mock MongoDB endpoints available:');
    console.log('- GET /check-member?name=X&nachname=Y');
    console.log('- GET /get-role?name=X&nachname=Y');
    console.log('- POST /save-member');
    console.log('- POST /update-role');
    console.log('- POST /delete-member');
    console.log('- POST /save-vertrag');
    console.log('- POST /save-password');
    console.log('\nTest data: John Doe already exists as Member');
});
