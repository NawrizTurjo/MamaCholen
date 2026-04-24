import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Vehicle, VehicleType } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const VEHICLE_ICONS: Record<VehicleType, string> = {
  'Car': `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>')}`,
  'CNG': `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10.5a1.5 1.5 0 0 1-1.5 1.5h-3"/><circle cx="17" cy="20" r="2"/><circle cx="7" cy="20" r="2"/><path d="M12 18V8"/><path d="M12 8h8"/></svg>')}`,
  'Motorcycle': `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="15" r="2"/><circle cx="17" cy="15" r="2"/><path d="M12 12h5l2 3"/><path d="M9 15h3"/><path d="M14 9V5"/><path d="M11 5h6"/><path d="M9 11l3-6"/><path d="M7 15l-3-3l1-4h3l3 3"/></svg>')}`,
  'Auto-Rickshaw': `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17h18"/><path d="M4 17V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>')}`,
};

const createVehicleIcon = (type: VehicleType, rotation: number) => {
  const color = type === 'Car' ? '#3b82f6' : type === 'Motorcycle' ? '#ef4444' : '#fbbf24';
  return L.divIcon({
    className: 'custom-vehicle-icon',
    html: `
      <div style="transform: rotate(${rotation}deg); transition: transform 0.5s ease-out; background: ${color}; backdrop-filter: blur(4px); padding: 8px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 0 20px ${color}80; display: flex; align-items: center; justify-content: center;">
        <img src="${VEHICLE_ICONS[type]}" width="24" height="24" />
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

interface MapProps {
  vehicles: Vehicle[];
  onVehicleClick: (vehicle: Vehicle) => void;
}

function MapController() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [map]);
  return null;
}

export default function Map({ vehicles, onVehicleClick }: MapProps) {
  const MIRPUR_1: [number, number] = [23.7956, 90.3537];

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer
        center={MIRPUR_1}
        zoom={16}
        zoomControl={false}
        className="h-full w-full"
      >
        <MapController />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {vehicles.map((v) => (
          <Marker
            key={v.id}
            position={v.position}
            icon={createVehicleIcon(v.type, v.rotation)}
            eventHandlers={{
              click: () => onVehicleClick(v),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
