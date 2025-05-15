# 🪦 GraveMap

Aplikacja React + Firebase do mapowania zmarłych i ich relacji, z backendem opartym na Node.js + Express.

---

## 📁 Struktura projektu

```
GraveMap/
├── client/       # frontend (React + Tailwind)
├── server/       # backend (Express.js + API)
├── README.md
```

---

## 🚀 Szybki start (produkcja)

> Serwuje frontend i backend z jednego portu (`http://localhost:5000`)

1. Zbuduj frontend (tylko po zmianach):

   ```bash
   cd client
   npm install
   npm run build
   ```

2. Uruchom backend (serwuje też frontend):

   ```bash
   cd ../server
   npm install
   node index.js
   ```

3. Otwórz:  
   👉 http://localhost:5000 – cała aplikacja będzie tam działać

---

## 💻 Tryb developerski (osobne serwery)

1. W jednym terminalu uruchom frontend:

   ```bash
   cd client
   npm start
   ```

2. W drugim terminalu uruchom backend:
   ```bash
   cd server
   node index.js
   ```

> Domyślnie:
>
> - Frontend: http://localhost:3000
> - Backend API: http://localhost:5000

> ⚠️ W pliku `client/package.json` dodaj:
>
> ```json
> "proxy": "http://localhost:5000"
> ```

---

## 🔧 Uruchamianie obu serwerów naraz (opcjonalnie)

W katalogu głównym (`GraveMap/`) dodaj plik `package.json` z:

```json
{
  "name": "gravemap-root",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "client": "cd client && npm start",
    "server": "cd server && npm start"
  },
  "devDependencies": {
    "concurrently": "^8.0.0"
  }
}
```

Potem uruchom:

```bash
npm install
npm run dev
```

---

## 🧪 Testowanie

- 🔎 Wejdź na `/api` → powinieneś zobaczyć JSON z komunikatem
- 🌐 Wejdź na `/` → pełna aplikacja React

---

## 📦 Wdrożenie

Aplikację można łatwo wdrożyć na:

- [Railway](https://railway.app)
- [Render](https://render.com)
- [Heroku](https://heroku.com)
- VPS

---

## 🔐 Zmienne środowiskowe

Użyj pliku `.env` (np. w `server/`) do ukrycia kluczy API:

```env
PORT=5000
FIREBASE_API_KEY=...
```

I w kodzie backendu:

```js
require("dotenv").config();
```

---

## 📍 Autor

GraveMap – aplikacja do wizualizacji pamięci o zmarłych.
