import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const icon = L.icon({ iconUrl, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });

export default function MapView({ complaints = [], center = [26.8467, 80.9462], height = "400px" }) {
  return (
    <div style={{ height }} className="rounded-2xl overflow-hidden border border-slate-200">
      <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {complaints
          .filter((c) => c.location?.latitude && c.location?.longitude)
          .map((c) => (
            <Marker key={c.complaintId} position={[c.location.latitude, c.location.longitude]} icon={icon}>
              <Popup>
                <p className="font-semibold">{c.complaintId}</p>
                <p>{c.category}</p>
                <p>Severity: {c.severity}</p>
                <p>Status: {c.status}</p>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
