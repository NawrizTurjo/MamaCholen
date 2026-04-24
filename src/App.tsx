import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import Chat from './components/Chat';
import { Vehicle, VehicleType, AppState } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Info, MapPin, Navigation, Star, User, Car, Phone, Handshake, AlertCircle, X, ChevronRight } from 'lucide-react';
import { cn } from './lib/utils';

const VEHICLE_TYPES: VehicleType[] = ['Car', 'CNG', 'Motorcycle', 'Auto-Rickshaw'];
const BENGALI_NAMES = ['Karim Mia', 'Abul Kashem', 'Sohail Rana', 'Mokhles Bepari', 'Hridoy Ahmed', 'Sakib Khan', 'Rubel Hossain', 'Jasim Uddin'];
const CAR_MODELS = ['Toyota Corolla', 'Pulsar 150', 'Bajaj RE', 'Mitsubishi Lancer', 'TVS Apache', 'Mahindra Alpha'];

const generateVehicles = (center: [number, number]): Vehicle[] => {
  return Array.from({ length: 4 }).map((_, i) => ({
    id: `v-${i}`,
    type: VEHICLE_TYPES[i % VEHICLE_TYPES.length],
    position: [
      center[0] + (Math.random() - 0.5) * 0.01,
      center[1] + (Math.random() - 0.5) * 0.01,
    ],
    rotation: Math.random() * 360,
    driver: {
      name: BENGALI_NAMES[Math.floor(Math.random() * BENGALI_NAMES.length)],
      rating: +(4 + Math.random() * 0.9).toFixed(1),
      license: `DHK-${Math.floor(1000 + Math.random() * 9000)}-${i}`,
      capacity: i === 2 ? 1 : 3,
      model: CAR_MODELS[Math.floor(Math.random() * CAR_MODELS.length)],
    },
  }));
};

export default function App() {
  const dhaka: [number, number] = [23.8103, 90.4125];
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => generateVehicles(dhaka));
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [destination, setDestination] = useState('Mirpur-1 to BUET');
  const [state, setState] = useState<AppState>('IDLE');
  const [dealAmount, setDealAmount] = useState<string | null>(null);

  // Live Movement Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          if (selectedVehicle?.id === v.id && state !== 'IDLE') return v;
          const newPos: [number, number] = [
            v.position[0] + (Math.random() - 0.5) * 0.0005,
            v.position[1] + (Math.random() - 0.5) * 0.0005,
          ];
          const latDiff = newPos[0] - v.position[0];
          const lngDiff = newPos[1] - v.position[1];
          const angle = Math.atan2(lngDiff, latDiff) * (180 / Math.PI);
          return { ...v, position: newPos, rotation: angle };
        })
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedVehicle, state]);

  const handleRequestRide = () => {
    setState('FINDING');
    setTimeout(() => {
      if (Math.random() < 0.3) {
        setState('REJECTED');
        setTimeout(() => setState('IDLE'), 3000);
      } else {
        setState('ACCEPTED');
      }
    }, 2500);
  };

  const closeBottomSheet = () => {
    if (state === 'IDLE' || state === 'SELECTING' || state === 'REJECTED') {
      setSelectedVehicle(null);
      setState('IDLE');
    }
  };

  return (
    <main className="h-screen w-full bg-black relative overflow-hidden font-sans">
      {/* Brand Overlay */}
      <nav className="absolute top-0 left-0 right-0 z-20 p-4 md:p-8 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(251,191,36,0.3)]">
            ম
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl md:text-2xl font-bold text-white m-0 leading-none">
              মামা, চলেন <span className="text-amber-400 font-light opacity-80">/ Mama, Cholen</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/40 mt-1">
              Intentional Friction • Ritual Sharing
            </p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-lg font-bold text-white">মামা, চলেন</h1>
          </div>
        </div>
        <div className="flex gap-2 md:gap-4 pointer-events-auto">
          <div className="status-pill backdrop-blur-md border-white/5">
            Dhanmondi, Dhaka
          </div>
          <div className="status-pill backdrop-blur-md border-amber-400/30 text-amber-400 hidden md:block">
            Live Traffic: High
          </div>
        </div>
      </nav>

      <Map
        vehicles={vehicles}
        onVehicleClick={(v) => {
          setSelectedVehicle(v);
          setState('SELECTING');
        }}
      />

      <AnimatePresence>
        {selectedVehicle && (
          <div className="fixed inset-0 z-40 flex items-end justify-center pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeBottomSheet}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
            />

            {/* Bottom Sheet */}
            <motion.div
              layoutId="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="glass-panel w-full max-w-md rounded-b-none md:rounded-b-[2.5rem] border-x border-t border-white/10 p-6 pb-12 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] pointer-events-auto relative z-50"
            >
              {/* Handle */}
              <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto mb-8" />

              {state === 'SELECTING' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-zinc-400">
                        <User size={28} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{selectedVehicle.driver.name}</h2>
                        <p className="text-sm text-zinc-500 font-medium">
                          {selectedVehicle.driver.model} • {selectedVehicle.type}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Star size={14} className="fill-yellow-500 text-yellow-500" />
                          <span className="text-xs font-bold">{selectedVehicle.driver.rating}</span>
                          <span className="text-[10px] text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded ml-1">
                            {selectedVehicle.driver.license}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button onClick={closeBottomSheet} className="p-2 bg-zinc-900 rounded-full text-zinc-500">
                      <X size={18} />
                    </button>
                  </div>

                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-1 text-zinc-500 text-xs">
                        <span>Route</span>
                        <span className="text-white">Mirpur-1 → BUET</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-500 text-xs">
                        <span>Initial Fare</span>
                        <span className="text-white font-bold">250 BDT</span>
                      </div>
                    </div>

                    <div className="bg-zinc-900/40 p-4 rounded-3xl border border-white/5 backdrop-blur-sm">
                      <label className="text-[10px] uppercase font-black text-zinc-500 mb-2 block tracking-[0.2em]">
                        Your Destination
                      </label>
                      <div className="flex items-center gap-3">
                        <MapPin size={18} className="text-amber-400" />
                        <input
                          value={destination}
                          onChange={(e) => setDestination(e.target.value)}
                          className="bg-transparent border-none text-white font-semibold focus:ring-0 p-0 w-full text-sm"
                          placeholder="Where are you going?"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleRequestRide}
                      className="w-full bg-amber-400 text-black font-black py-5 rounded-3xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-tight text-lg shadow-[0_10px_30px_rgba(251,191,36,0.2)]"
                    >
                      Request Ride
                      <ChevronRight size={20} strokeWidth={3} />
                    </button>
                </div>
              )}

              {state === 'FINDING' && (
                <div className="py-12 flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 bg-yellow-500/20 rounded-full"
                    />
                    <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center border border-white/10 relative z-10">
                      <Navigation className="text-yellow-500 animate-pulse" size={32} />
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold">Calling Mama...</h3>
                    <p className="text-zinc-500 text-sm">Asking {selectedVehicle.driver.name} to accept.</p>
                  </div>
                </div>
              )}

              {state === 'REJECTED' && (
                <div className="py-12 flex flex-col items-center justify-center space-y-6">
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                    <AlertCircle className="text-red-500" size={32} />
                  </div>
                  <div className="text-center px-8">
                    <h3 className="text-xl font-bold">Mama jabe na.</h3>
                    <p className="text-zinc-500 text-sm">Driver refused to go. Trying to find another vehicle soon...</p>
                  </div>
                </div>
              )}

              {state === 'ACCEPTED' && (
                <div className="py-8 space-y-8">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20 text-green-500 mb-4">
                      <BadgeCheck size={32} />
                    </div>
                    <h3 className="text-2xl font-black italic">MAMA RAJI!</h3>
                    <p className="text-zinc-400 text-sm">Driver arrived. Now for the ritual.</p>
                  </div>

                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-[2rem] text-center">
                    <p className="text-yellow-500 text-sm font-bold uppercase tracking-widest mb-4">Initial Quote: 250 BDT</p>
                    <button
                      onClick={() => setState('BARGAINING')}
                      className="w-full bg-yellow-500 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-2 text-xl tracking-tighter"
                    >
                      Bargain with Mama
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state === 'BARGAINING' && selectedVehicle && (
          <Chat
            vehicle={selectedVehicle}
            destination={destination}
            onDealDone={(amount) => {
              setDealAmount(amount);
              setState('FINISHED');
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state === 'FINISHED' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 12 }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="bg-white/5 p-8 rounded-full border border-white/10"
                >
                  <Handshake size={80} className="text-yellow-500" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -top-4 -right-4 bg-green-500 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase"
                >
                  Deal Done
                </motion.div>
              </div>

              <div className="space-y-2">
                <h2 className="text-4xl font-black tracking-tighter">{dealAmount} BDT</h2>
                <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                  Connection earned, not just transacted. You just saved the ritual.
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedVehicle(null);
                  setState('IDLE');
                  setDealAmount(null);
                }}
                className="bg-white text-black px-12 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all"
              >
                Find New Connection
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function BadgeCheck({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
