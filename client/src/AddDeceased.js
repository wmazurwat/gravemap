import React, { useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import MapPicker from "./MapPicker";

const AddDeceased = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [deathPlace, setDeathPlace] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("Wybierz lokalizację na mapie lub użyj swojej.");
      return;
    }

    try {
      await addDoc(collection(db, "deceased"), {
        firstName,
        lastName,
        birthDate,
        deathDate,
        birthPlace,
        deathPlace,
        bio,
        location,
        addedBy: auth.currentUser?.uid || "anon",
      });

      alert("Dodano zmarłego");

      // Resetowanie pól formularza
      setFirstName("");
      setLastName("");
      setBirthDate("");
      setDeathDate("");
      setBirthPlace("");
      setDeathPlace("");
      setBio("");
      setLocation(null);
    } catch (err) {
      alert("Błąd: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Dodaj zmarłego</h2>

      <input
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="Imię"
        required
      />
      <input
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Nazwisko"
        required
      />
      <input
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        required
      />
      <input
        type="date"
        value={deathDate}
        onChange={(e) => setDeathDate(e.target.value)}
        required
      />
      <input
        value={birthPlace}
        onChange={(e) => setBirthPlace(e.target.value)}
        placeholder="Miejsce urodzenia"
      />
      <input
        value={deathPlace}
        onChange={(e) => setDeathPlace(e.target.value)}
        placeholder="Miejsce śmierci"
      />
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Biografia"
        rows={4}
      />

      <MapPicker location={location} setLocation={setLocation} />

      <button type="submit">Zapisz</button>
    </form>
  );
};

export default AddDeceased;
