// src/components/MapView.jsx
import { MapContainer, TileLayer } from 'react-leaflet';

const MapView = () => {
  return (
    <MapContainer
      center={[36.5, 127.5]}
      zoom={7}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
    </MapContainer>
  );
};

export default MapView;
