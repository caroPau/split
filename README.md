
# Gruppen- und Ausgabenverwaltungssystem

## Projektübersicht

Dieses Projekt ist ein **Gruppen- und Ausgabenverwaltungssystem**, das es Benutzern ermöglicht, Gruppen zu erstellen, Ausgaben innerhalb dieser Gruppen zu verwalten und die Salden der Gruppenmitglieder zu berechnen. Das System bietet Benutzern die Möglichkeit, sich zu registrieren, anzumelden, Gruppen zu erstellen und ihre persönlichen Ausgaben innerhalb dieser Gruppen zu verwalten.

## Features

- **Benutzerregistrierung und -anmeldung**: Benutzer können sich registrieren und anmelden, um auf die Anwendung zuzugreifen.
- **Gruppenerstellung**: Benutzer können Gruppen erstellen und Mitglieder zu diesen Gruppen hinzufügen.
- **Ausgabenverwaltung**: Benutzer können Ausgaben in einer Gruppe hinzufügen, und die Anwendung verwaltet die Salden der Mitglieder automatisch.
- **Gruppenübersicht**: Benutzer können ihre Gruppen einsehen und erhalten Live Updates zu Ausgaben, die von anderen Mitgliedern hinzugefügt werden.

## Installation

### Voraussetzungen

Stellen Sie sicher, dass die folgenden Programme auf Ihrem System installiert sind:

- [Node.js](https://nodejs.org/) (Version 14 oder höher)
- [npm](https://www.npmjs.com/) (wird mit Node.js geliefert)
- [MongoDB](https://www.mongodb.com/) (lokal oder über einen Cloud-Dienst wie MongoDB Atlas)

### Schritt-für-Schritt-Anleitung

1. **Projekt öffnen:**

   Öffnen Sie ein Terminal und navigieren Sie zum Projektverzeichnis.

  

2. **Umgebungsvariablen konfigurieren:**

   Erstellen Sie eine `.env`-Datei im Stammverzeichnis des Projekts und fügen Sie die folgenden Umgebungsvariablen hinzu:

   ```plaintext
   NODE_ENV=development
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/splitmate
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=90d
   ```

   - **MONGO_URI**: Geben Sie hier die URI Ihrer MongoDB-Datenbank an.
   - **JWT_SECRET**: Definieren Sie einen geheimen Schlüssel für die JWT-Authentifizierung.

3. **Abhängigkeiten installieren:**

   Installieren Sie alle notwendigen npm-Pakete:

   ```bash
   npm install
   ```

4. **Anwendung starten:**

   Starten Sie die Anwendung mit dem folgenden Befehl:

   ```bash
   npm run dev
   ```

   Die Anwendung läuft nun auf `http://localhost:3000`.

5. **Datenbank einrichten:**

   Stellen Sie sicher, dass MongoDB läuft und Ihre Datenbankverbindung erfolgreich ist. Wenn Sie MongoDB lokal verwenden, starten Sie den MongoDB-Dienst mit:

   ```bash
   mongod
   ```

   Wenn Sie MongoDB Atlas verwenden, stellen Sie sicher, dass Ihre Verbindung in der `.env`-Datei korrekt konfiguriert ist.

### Projektstruktur

- **`controllers/`**: Enthält die Controller-Logik für Benutzer, Gruppen und Ausgaben.
- **`models/`**: Beinhaltet die Mongoose-Modelle für Benutzer, Gruppen und Ausgaben.
- **`routes/`**: Definiert die Routen für Benutzer, Gruppen und Ausgaben.
- **`utils/`**: Hilfsfunktionen und Favicon.
- **`views/`**: HTML-Seiten für die Benutzeroberfläche.

### Wichtige Endpunkte

- **POST `/api/v1/users/register`**: Registriert einen neuen Benutzer.
- **POST `/api/v1/users/login`**: Loggt einen Benutzer ein und gibt ein JWT zurück.
- **GET `/api/v1/groups`**: Ruft alle Gruppen eines Benutzers ab.
- **GET `/api/v1/groups/:id`**: Ruft eine einzelne Gruppe ab.
- **POST `/api/v1/groups/newGroup/create`**: Erstellt eine neue Gruppe.
- **POST `/api/v1/groups/:id/expenses`**: Fügt einer Gruppe eine neue Ausgabe hinzu.

## Verwendung

1. **Registrieren Sie sich**: Rufen Sie die Startseite auf und registrieren Sie sich.
2. **Gruppen erstellen**: Loggen Sie sich ein und erstellen Sie eine neue Gruppe.
3. **Ausgaben hinzufügen**: Fügen Sie Ausgaben zu einer Gruppe hinzu und sehen Sie sich die Salden der Mitglieder an.

