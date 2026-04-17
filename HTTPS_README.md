# HTTPS Setup für den Server

## Self-Signed Zertifikate erstellen (für lokalen Test)

1. Installiere OpenSSL (auf Windows: über Git Bash oder Chocolatey: `choco install openssl`).

2. Führe aus:
   ```
   openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/C=DE/ST=State/L=City/O=Org/CN=localhost"
   ```

3. Platziere `key.pem` und `cert.pem` im Projektordner.

4. Starte den Server: `node server.js`

5. Öffne https://localhost:3000 (Browser warnt vor unsicherem Zertifikat – akzeptiere es).

## Für Produktion (echte Zertifikate)

Verwende Let's Encrypt (kostenlos) oder kaufe Zertifikate.

Für Heroku/Render ist HTTPS automatisch.

## Code-Änderungen

Der Server verwendet jetzt `https` statt `http`. Stelle sicher, dass die Zertifikat-Dateien vorhanden sind.