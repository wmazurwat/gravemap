import React, { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px'
};

const center = {
  lat: 52.2297,
  lng: 21.0122
};

const MapPicker = ({ onLocationSelect }) => {
  const [marker, setMarker] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyCgRv6CdU4VNZxJc52L5y8TKCQ2Bh6g7Ys' // 🔑 <- tutaj swój klucz z Google Cloud
  });

  const onMapClick = useCallback((e) => {
    const position = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };
    setMarker(position);
    onLocationSelect(position);
  }, [onLocationSelect]);

  if (!isLoaded) return <p>Ładowanie mapy...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      onClick={onMapClick}
    >
      {marker && <Marker position={marker} />}
    </GoogleMap>
  );
};

export default React.memo(MapPicker);
