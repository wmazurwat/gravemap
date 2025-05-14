import React, { useEffect, useState, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = {
  lat: 52.2297,
  lng: 21.0122,
};

const AllMap = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyCPZGNi4jss3jiCfEMdjfGOP9qynx5TgPY",
  });

  console.log("Loader:", isLoaded, loadError);
  const [deceasedList, setDeceasedList] = useState([]);
  const [selected, setSelected] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;

    const fetchDeceased = async () => {
      const snap = await getDocs(collection(db, "deceased"));
      const list = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((d) => d.location && d.location.lat && d.location.lng);
      setDeceasedList(list);
    };

    fetchDeceased();
  }, [isLoaded]);

  if (!isLoaded) return <p>Ładowanie mapy...</p>;

  return (
    <div>
      console.log("AllMap component rendered");
      <h2>Mapa wszystkich zmarłych</h2>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={6}
        onLoad={(map) => (mapRef.current = map)}
      >
        {deceasedList.map((person) => (
          <Marker
            key={person.id}
            position={{ lat: person.location.lat, lng: person.location.lng }}
            onClick={() => setSelected(person)}
          />
        ))}

        {selected && (
          <InfoWindow
            position={{
              lat: selected.location.lat,
              lng: selected.location.lng,
            }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <strong>
                {selected.firstName} {selected.lastName}
              </strong>
              <br />
              <button onClick={() => navigate(`/person/${selected.id}`)}>
                Zobacz profil
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default AllMap;
