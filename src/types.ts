export type VehicleType = 'Car' | 'CNG' | 'Motorcycle' | 'Auto-Rickshaw';

export interface Vehicle {
  id: string;
  type: VehicleType;
  position: [number, number];
  rotation: number;
  driver: {
    name: string;
    rating: number;
    license: string;
    capacity: number;
    model: string;
  };
}

export type AppState = 'IDLE' | 'SELECTING' | 'FINDING' | 'REJECTED' | 'ACCEPTED' | 'BARGAINING' | 'FINISHED';
