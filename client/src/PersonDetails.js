import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const PersonDetails = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);

  // pobierz dane zmarłego
  useEffect(() => {
    const fetchPerson = async () => {
      const docRef = doc(db, "deceased", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPerson({ id: docSnap.id, ...docSnap.data() });
      }
    };

    const fetchNotes = async () => {
      const q = query(collection(db, "notes"), where("personId", "==", id));
      const snapshot = await getDocs(q);
      setNotes(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchImages = async () => {
      const q = query(collection(db, "images"), where("personId", "==", id));
      const snapshot = await getDocs(q);
      setImages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchPerson();
    fetchNotes();
    fetchImages();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    await addDoc(collection(db, "notes"), {
      personId: id,
      content: note,
      author: auth.currentUser?.displayName || "anonim",
      createdAt: serverTimestamp(),
    });
    setNote("");
    window.location.reload();
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    const imageRef = ref(storage, `images/${id}/${image.name}`);
    await uploadBytes(imageRef, image);
    const url = await getDownloadURL(imageRef);

    await addDoc(collection(db, "images"), {
      personId: id,
      url,
      uploadedAt: serverTimestamp(),
      uploadedBy: auth.currentUser?.displayName || "anonim",
    });

    setImage(null);
    window.location.reload();
  };

  if (!person) return <p>Ładowanie danych...</p>;

  return (
    <div>
      <h2>
        {person.firstName} {person.lastName}
      </h2>
      <p>
        Data urodzenia: {person.birthDate}, miejsce: {person.birthPlace}
        <br />
        Data śmierci: {person.deathDate}, miejsce: {person.deathPlace}
        <br />
        <em>{person.bio}</em>
      </p>

      <h3>Notatki</h3>
      <form onSubmit={handleAddNote}>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Dodaj notatkę..."
          rows={3}
          style={{ width: "100%" }}
        />
        <button type="submit">Dodaj notatkę</button>
      </form>

      <ul>
        {notes.map((n) => (
          <li key={n.id}>
            <strong>{n.author}</strong> (
            {n.createdAt?.toDate().toLocaleString() || "⏳"}):
            <br />
            {n.content}
          </li>
        ))}
      </ul>

      <h3>Zdjęcia</h3>
      <form onSubmit={handleImageUpload}>
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
        />
        <button type="submit">Wyślij zdjęcie</button>
      </form>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "10px",
        }}
      >
        {images.map((img) => (
          <div key={img.id}>
            <img src={img.url} alt="zdjęcie" width="150" />
            <p style={{ fontSize: "0.8em" }}>
              {img.uploadedBy},{" "}
              {img.uploadedAt?.toDate().toLocaleString() || "⏳"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonDetails;
