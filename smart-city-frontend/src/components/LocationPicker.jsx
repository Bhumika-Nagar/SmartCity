import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Default Leaflet marker icons don't resolve correctly under bundlers unless
// pointed at the CDN explicitly.
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const DEFAULT_CENTER = [28.6139, 77.209]; // New Delhi as a sensible civic default

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({ value, onChange }) {
  const [position, setPosition] = useState(value || null);

  const handlePick = (latlng) => {
    setPosition(latlng);
    onChange({ ...latlng, address: value?.address || '' });
  };

  return (
    <div className="rounded-ticket overflow-hidden border border-line">
      <MapContainer
        center={position || DEFAULT_CENTER}
        zoom={13}
        style={{ height: '260px', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onPick={handlePick} />
        {position && <Marker position={[position.lat, position.lng]} icon={markerIcon} />}
      </MapContainer>
      <p className="text-xs font-mono text-inkmuted px-3 py-2 bg-concrete">
        {position
          ? `Pinned at ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
          : 'Tap the map to drop a pin at the complaint location'}
      </p>
    </div>
  );
}
