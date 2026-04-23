import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createCustomIcon(color = '#3b9bf3') {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 32px; height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

function FitBounds({ markers }) {
  const map = useMap();
  useEffect(() => {
    if (markers && markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [markers, map]);
  return null;
}

export default function MapView({ markers = [], center = [20, 0], zoom = 3, height = '400px' }) {
  const primaryMarker = markers[0];
  const mapCenter = primaryMarker ? [primaryMarker.lat, primaryMarker.lng] : center;

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10" style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, i) => (
          <Marker
            key={i}
            position={[marker.lat, marker.lng]}
            icon={createCustomIcon(i === 0 ? '#3b9bf3' : '#fd4f0f')}
          >
            <Popup>
              <div className="text-sm font-medium">{marker.name || marker.label}</div>
              {marker.description && (
                <div className="text-xs text-gray-500 mt-1">{marker.description}</div>
              )}
            </Popup>
          </Marker>
        ))}
        {markers.length > 1 && <FitBounds markers={markers} />}
      </MapContainer>
    </div>
  );
}
