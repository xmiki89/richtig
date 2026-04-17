# MongoDB Atlas Setup für BlackOath

## 1. MongoDB Atlas Account erstellen
1. Gehe zu: https://cloud.mongodb.com
2. Klicke auf "Try Free" → "Register"
3. Registriere dich mit Email oder Google/GitHub

## 2. Neues Projekt erstellen
1. Nach Login: Klicke "New Project"
2. Projektname: "BlackOath"
3. Organisation auswählen oder erstellen

## 3. Cluster erstellen (Free Tier)
1. Klicke "Build a Cluster"
2. Wähle "M0 Sandbox" (kostenlos)
3. Wähle eine Region (z.B. Frankfurt)
4. Klicke "Create Cluster"

## 4. Database User erstellen
1. Links: "Database Access" → "Add New Database User"
2. Username: dein Benutzername
3. Password: starkes Passwort
4. Permissions: "Read and write to any database"

## 5. IP-Whitelist einrichten
1. Links: "Network Access" → "Add IP Address"
2. Wähle "Allow Access from Anywhere" (0.0.0.0/0)
3. Klicke "Confirm"

## 6. Connection String bekommen
1. Gehe zu "Clusters" → "Connect"
2. Wähle "Connect your application"
3. Kopiere den Connection String

## 7. .env Datei erstellen
Erstelle eine .env Datei im Projektordner:
```
MONGODB_URI="mongodb+srv://<DEIN_USERNAME>:<DEIN_PASSWORT>@<DEIN_CLUSTER>.mongodb.net/BlackOath?retryWrites=true&w=majority"
```

Ersetze:
- <DEIN_USERNAME> mit deinem Database User
- <DEIN_PASSWORT> mit deinem Passwort  
- <DEIN_CLUSTER> mit deinem Cluster Namen

## 8. Daten ansehen
1. Gehe zu "Collections" in deinem Cluster
2. Klicke auf die Collections:
   - members (Mitgliedsdaten)
   - contracts (Vertragsdaten)
   - passwords (Passwörter)

## 9. Server starten
```bash
node server-http.js
```

Jetzt werden alle Registrierungen in MongoDB Atlas gespeichert!
