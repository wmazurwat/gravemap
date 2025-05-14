import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { db, auth, storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import RelationGraph from "./RelationGraph";

const RELATION_TYPES = {
  rodzic: "dziecko",
  dziecko: "rodzic",
  mąż: "żona",
  żona: "mąż",
  partner: "partner",
  sąsiad: "sąsiad",
  kolega: "kolega",
  opiekun: "podopieczny",
  podopieczny: "opiekun",
  znajomy: "znajomy",
};

const PersonDetails = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [relativesDetails, setRelativesDetails] = useState([]);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [relationType, setRelationType] = useState("rodzic");
  const [targetId, setTargetId] = useState("");
  const [allPeople, setAllPeople] = useState([]);

  useEffect(() => {
    const fetchRelatives = async (personData) => {
      const ids = personData.relatives?.map((r) => r.id) || [];
      if (ids.length === 0) return;
      const all = await getDocs(collection(db, "deceased"));
      const related = all.docs
        .filter((doc) => ids.includes(doc.id))
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setRelativesDetails(related);
    };

    const fetchData = async () => {
      const docRef = doc(db, "deceased", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const personData = { id: docSnap.id, ...docSnap.data() };
        setPerson(personData);
        fetchRelatives(personData);
        setEditData({
          firstName: personData.firstName || "",
          lastName: personData.lastName || "",
          birthDate: personData.birthDate || "",
          deathDate: personData.deathDate || "",
          birthPlace: personData.birthPlace || "",
          deathPlace: personData.deathPlace || "",
          bio: personData.bio || "",
        });
      }

      const notesSnap = await getDocs(
        query(collection(db, "notes"), where("personId", "==", id))
      );
      setNotes(notesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const imagesSnap = await getDocs(
        query(collection(db, "images"), where("personId", "==", id))
      );
      setImages(imagesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const peopleSnap = await getDocs(collection(db, "deceased"));
      setAllPeople(
        peopleSnap.docs
          .filter((doc) => doc.id !== id)
          .map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchData();
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

  const addRelation = async () => {
    if (!relationType || !targetId) return;
    const reverseType = RELATION_TYPES[relationType] || relationType;
    const currentRef = doc(db, "deceased", id);
    const targetRef = doc(db, "deceased", targetId);
    await updateDoc(currentRef, {
      relatives: arrayUnion({ id: targetId, type: relationType }),
    });
    await updateDoc(targetRef, {
      relatives: arrayUnion({ id: id, type: reverseType }),
    });
    alert("Relacja została dodana.");
    setTargetId("");
    setRelationType("rodzic");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, "deceased", id), editData);
    alert("Dane zapisane!");
    setEditing(false);
    window.location.reload();
  };

  if (!person) return <p>Ładowanie danych...</p>;

  return (
    <div>
      <button onClick={() => setEditing(!editing)}>
        {editing ? "Anuluj edycję" : "Edytuj dane"}
      </button>

      {editing && (
        <form onSubmit={handleUpdate}>
          <input
            value={editData.firstName}
            onChange={(e) =>
              setEditData({ ...editData, firstName: e.target.value })
            }
            placeholder="Imię"
            required
          />
          <input
            value={editData.lastName}
            onChange={(e) =>
              setEditData({ ...editData, lastName: e.target.value })
            }
            placeholder="Nazwisko"
            required
          />
          <input
            type="date"
            value={editData.birthDate}
            onChange={(e) =>
              setEditData({ ...editData, birthDate: e.target.value })
            }
          />
          <input
            type="date"
            value={editData.deathDate}
            onChange={(e) =>
              setEditData({ ...editData, deathDate: e.target.value })
            }
          />
          <input
            value={editData.birthPlace}
            onChange={(e) =>
              setEditData({ ...editData, birthPlace: e.target.value })
            }
            placeholder="Miejsce urodzenia"
          />
          <input
            value={editData.deathPlace}
            onChange={(e) =>
              setEditData({ ...editData, deathPlace: e.target.value })
            }
            placeholder="Miejsce śmierci"
          />
          <textarea
            value={editData.bio}
            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
            placeholder="Biografia"
          />
          <button type="submit">Zapisz zmiany</button>
        </form>
      )}

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

      {person.relatives?.length > 0 && (
        <>
          <h3>Relacje</h3>
          <ul>
            {person.relatives.map((rel) => {
              const target = relativesDetails.find((p) => p.id === rel.id);
              return (
                <li key={rel.id}>
                  {rel.type}:{" "}
                  {target ? (
                    <a href={`/person/${rel.id}`}>
                      {target.firstName} {target.lastName}
                    </a>
                  ) : (
                    "(brak danych)"
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}

      <h3>Dodaj relację</h3>
      <select
        value={relationType}
        onChange={(e) => setRelationType(e.target.value)}
      >
        {Object.keys(RELATION_TYPES).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select value={targetId} onChange={(e) => setTargetId(e.target.value)}>
        <option value="">-- wybierz osobę --</option>
        {allPeople.map((p) => (
          <option key={p.id} value={p.id}>
            {p.firstName} {p.lastName}
          </option>
        ))}
      </select>

      <button onClick={addRelation}>Zapisz relację</button>

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
      <RelationGraph person={person} relatives={relativesDetails} />
    </div>
  );
};

export default PersonDetails;
