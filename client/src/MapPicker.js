import React, { useEffect, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 52.2297, // Warszawa
  lng: 21.0122
};

const MapPicker = ({ location, setLocation }) => {
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCgRv6CdU4VNZxJc52L5y8TKCQ2Bh6g7Ys'
  });

  // 👉 Automatyczne pobranie lokalizacji przy starcie
  useEffect(() => {
    if (navigator.geolocation && !location) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setLocation(coords);
          if (mapRef.current) mapRef.current.panTo(coords);
        },
        (err) => {
          console.warn('Brak zgody na lokalizację:', err.message);
        }
      );
    }
  }, [location, setLocation]);

  const handleClick = (e) => {
    const coords = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setLocation(coords);
  };

  if (!isLoaded) return <p>Ładowanie mapy...</p>;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location || defaultCenter}
        zoom={13}
        onClick={handleClick}
        onLoad={(map) => (mapRef.current = map)}
      >
        {location && <Marker position={location} />}
      </GoogleMap>

      <p>Wybrana lokalizacja: {location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : 'Brak'}</p>
    </div>
  );
};

export default React.memo(MapPicker);


