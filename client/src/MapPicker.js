import React, { useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 52.2297,
  lng: 21.0122,
};

const MapPicker = ({ location, setLocation }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef(null);

  const handleClick = (e) => {
    setLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setLocation(coords);
          if (mapRef.current) {
            mapRef.current.panTo(coords);
          }
        },
        () => {
          alert("Nie udało się pobrać lokalizacji.");
        }
      );
    } else {
      alert("Geolokalizacja nie jest wspierana.");
    }
  };

  if (loadError) return <p>Błąd ładowania mapy: {loadError.message}</p>;
  if (!isLoaded) return <p>Ładowanie mapy...</p>;

  return (
    <div>
      <button type="button" onClick={handleUseMyLocation}>
        Użyj mojej lokalizacji
      </button>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location || defaultCenter}
        zoom={13}
        onClick={handleClick}
        onLoad={(map) => (mapRef.current = map)}
      >
        {location && <Marker position={location} />}
      </GoogleMap>

      <p>
        Wybrana lokalizacja:{" "}
        {location
          ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`
          : "Brak"}
      </p>
    </div>
  );
};

export default MapPicker;
