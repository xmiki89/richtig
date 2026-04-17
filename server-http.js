const http = require('http');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let db;
let membersCollection;
let contractsCollection;

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        db = client.db('BlackOath');
        membersCollection = db.collection('members');
        contractsCollection = db.collection('contracts');
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

connectDB();

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
        
        (async () => {
            try {
                const member = await membersCollection.findOne({ name, nachname });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ exists: !!member }));
            } catch (error) {
                console.error('Error checking member:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Database error' }));
            }
        })();
    } else if (req.method === 'GET' && req.url.startsWith('/get-role')) {
        const params = new URL(req.url, 'http://localhost').searchParams;
        const name = params.get('name') || '';
        const nachname = params.get('nachname') || '';
        
        (async () => {
            try {
                const member = await membersCollection.findOne({ name, nachname });
                const role = member?.role || 'Member';
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ role }));
            } catch (error) {
                console.error('Error getting role:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ role: 'Member' }));
            }
        })();
    } else if (req.method === 'POST' && req.url === '/delete-member') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            (async () => {
                try {
                    const { name, nachname } = JSON.parse(body);
                    await membersCollection.deleteOne({ name, nachname });
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'Deleted' }));
                } catch (error) {
                    console.error('Error deleting member:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error deleting member' }));
                }
            })();
        });
    } else if (req.method === 'POST' && req.url === '/save-vertrag') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            (async () => {
                try {
                    const { vertragsname, material, ziel, mitglieder, stueckData } = JSON.parse(body);
                    const contract = {
                        vertragsname,
                        material,
                        ziel,
                        mitglieder,
                        stueckData,
                        createdAt: new Date()
                    };
                    await contractsCollection.insertOne(contract);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'OK' }));
                } catch (error) {
                    console.error('Error saving contract:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error saving contract' }));
                }
            })();
        });
    } else if (req.method === 'POST' && req.url === '/update-role') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            (async () => {
                try {
                    const { name, nachname, role } = JSON.parse(body);
                    await membersCollection.updateOne(
                        { name, nachname },
                        { $set: { role } }
                    );
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'Role updated successfully' }));
                } catch (error) {
                    console.error('Error updating role:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error updating role' }));
                }
            })();
        });
    } else if (req.method === 'POST' && req.url === '/save-member') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            (async () => {
                try {
                    const { name, nachname, email, id, password } = JSON.parse(body);
                    const memberData = {
                        name,
                        nachname,
                        email,
                        id,
                        password,
                        role: 'Member',
                        createdAt: new Date()
                    };
                    
                    await membersCollection.updateOne(
                        { name, nachname },
                        { $set: memberData },
                        { upsert: true }
                    );
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'Member saved successfully' }));
                } catch (error) {
                    console.error('Error saving member:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error saving member' }));
                }
            })();
        });
    } else if (req.method === 'POST' && req.url === '/save-password') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            (async () => {
                try {
                    const passwordEntry = {
                        data: body,
                        createdAt: new Date()
                    };
                    const passwordsCollection = db.collection('passwords');
                    await passwordsCollection.insertOne(passwordEntry);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'Password saved' }));
                } catch (error) {
                    console.error('Error saving password:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Error saving password' }));
                }
            })();
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
    console.log('MongoDB endpoints available:');
    console.log('- GET /check-member?name=X&nachname=Y');
    console.log('- GET /get-role?name=X&nachname=Y');
    console.log('- POST /save-member');
    console.log('- POST /update-role');
    console.log('- POST /delete-member');
    console.log('- POST /save-vertrag');
    console.log('- POST /save-password');
});
