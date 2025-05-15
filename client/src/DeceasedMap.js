import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 52.2297,
  lng: 21.0122,
};

const DeceasedMap = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [people, setPeople] = useState([]);
  const [activePerson, setActivePerson] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;

    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "deceased"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPeople(list.filter((p) => p.location)); // tylko z lokalizacją
    };
    fetchData();
  }, [isLoaded]);

  if (loadError) return <p>Błąd ładowania mapy: {loadError.message}</p>;
  if (!isLoaded) return <p>Ładowanie mapy...</p>;

  return (
    <div>
      <h2>Mapa zmarłych</h2>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={6}>
        {people.map((person) => (
          <Marker
            key={person.id}
            position={person.location}
            onClick={() => setActivePerson(person)}
          />
        ))}

        {activePerson && (
          <InfoWindow
            position={activePerson.location}
            onCloseClick={() => setActivePerson(null)}
          >
            <div style={{ maxWidth: "200px" }}>
              <strong>
                {activePerson.firstName} {activePerson.lastName}
              </strong>
              <br />
              ur. {activePerson.birthDate} w {activePerson.birthPlace}
              <br />
              zm. {activePerson.deathDate} w {activePerson.deathPlace}
              <br />
              <em>{activePerson.bio}</em>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default React.memo(DeceasedMap);
