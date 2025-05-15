// Wyłącz problematyczne zmienne środowiskowe (ochrona przed błędami parsera debuggera)
delete process.env.DEBUG_URL;
process.env.DEBUG = "";

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint (możesz rozbudować o więcej tras backendowych)
app.get("/api", (req, res) => {
  res.json({ message: "API GraveMap działa poprawnie" });
});

// Serwowanie statycznych plików frontendowych (React build)
app.use(express.static(path.join(__dirname, "../client/build")));

// Każda inna trasa → React (dla routera)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Start serwera
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Serwer działa na porcie ${PORT}`);
});
