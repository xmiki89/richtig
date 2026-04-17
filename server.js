const http = require('http');
const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, getDocs, query, where } = require('firebase/firestore');
require('dotenv').config();

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('Firebase initialized successfully');

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
                const memberRef = doc(db, 'members', `${name}_${nachname}`);
                const memberSnap = await getDoc(memberRef);
                const exists = memberSnap.exists();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ exists }));
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
                const memberRef = doc(db, 'members', `${name}_${nachname}`);
                const memberSnap = await getDoc(memberRef);
                const role = memberSnap.exists() ? memberSnap.data().role || 'Member' : 'Member';
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
                    const memberRef = doc(db, 'members', `${name}_${nachname}`);
                    await deleteDoc(memberRef);
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
                    const contractId = `${vertragsname}_${Date.now()}`;
                    const contractRef = doc(db, 'contracts', contractId);
                    const contract = {
                        vertragsname,
                        material,
                        ziel,
                        mitglieder,
                        stueckData,
                        createdAt: new Date()
                    };
                    await setDoc(contractRef, contract);
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
                    const memberRef = doc(db, 'members', `${name}_${nachname}`);
                    await updateDoc(memberRef, { role });
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

                    const memberRef = doc(db, 'members', `${name}_${nachname}`);
                    await setDoc(memberRef, memberData);

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
                    const passwordId = `password_${Date.now()}`;
                    const passwordRef = doc(db, 'passwords', passwordId);
                    await setDoc(passwordRef, passwordEntry);
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

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
});
