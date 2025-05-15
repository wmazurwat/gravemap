import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddDeceased from "./AddDeceased";
import Home from "./Home";
import DeceasedList from "./DeceasedList";
import DeceasedMap from "./DeceasedMap";
import PersonDetails from "./PersonDetails";
import AllMap from "./AllMap";
import { auth } from "./firebase";
import { useJsApiLoader } from "@react-google-maps/api";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!isLoaded)
    return (
      <p className="text-center text-gray-500 mt-10">Ładowanie map Google...</p>
    );

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center">
        <nav className="w-full bg-white shadow-md py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-2xl font-bold text-gray-800">GraveMap</span>
          {user ? (
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Start
              </Link>
              <Link
                to="/add"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Dodaj zmarłego
              </Link>
              <Link
                to="/list"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Lista
              </Link>
              <Link
                to="/map"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Mapa
              </Link>
              <button
                onClick={() => auth.signOut()}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Wyloguj się
              </button>
            </div>
          ) : (
            <p className="text-gray-600 text-sm">
              Zaloguj się, aby kontynuować
            </p>
          )}
        </nav>
        <p className="text-red-500 font-bold">Test Tailwinda</p>

        {user && (
          <div className="w-full text-center text-sm text-gray-600 mt-2 mb-4">
            Zalogowany jako: <strong>{user.displayName || user.email}</strong>
          </div>
        )}

        <main className="w-full max-w-5xl px-4 py-6">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route
              path="/add"
              element={
                user ? (
                  <AddDeceased isLoaded={isLoaded} />
                ) : (
                  <Home user={user} />
                )
              }
            />
            <Route
              path="/map"
              element={user ? <DeceasedMap /> : <Home user={user} />}
            />
            <Route
              path="/person/:id"
              element={user ? <PersonDetails /> : <Home user={user} />}
            />
            <Route
              path="/list"
              element={user ? <DeceasedList /> : <Home user={user} />}
            />
            <Route path="/mapa" element={<AllMap isLoaded={isLoaded} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
