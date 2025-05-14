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

function App() {
  const [user, setUser] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCPZGNi4jss3jiCfEMdjfGOP9qynx5TgPY",
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!isLoaded) return <p>Ładowanie map Google...</p>;

  return (
    <Router>
      <nav style={{ marginBottom: "20px" }}>
        {user ? (
          <>
            <Link to="/">Start</Link> | <Link to="/add">Dodaj zmarłego</Link>
            <Link to="/list">Lista</Link>
            <Link to="/map">Mapa</Link>
            <span style={{ marginLeft: "20px" }}>
              Zalogowany jako: {user.displayName || user.email}
            </span>
            <button
              onClick={() => auth.signOut()}
              style={{ marginLeft: "20px" }}
            >
              Wyloguj się
            </button>
          </>
        ) : (
          <span>Zaloguj się, aby kontynuować</span>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route
          path="/add"
          element={
            user ? <AddDeceased isLoaded={isLoaded} /> : <Home user={user} />
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
    </Router>
  );
}

export default App;
