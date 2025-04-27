
export interface GHGOption {
  value: string;
  label: string;
  co2Factor: number;
}

export interface GHGParameter {
  id: string;
  label: string;
  options?: GHGOption[];
  unit?: string;
}

export const personalGHGParams: GHGParameter[] = [
  { id: "commute", label: "Daily Commute", options: [
    { value: "public", label: "Public Transport", co2Factor: 0.05 },
    { value: "car_petrol", label: "Car (Petrol)", co2Factor: 0.2 },
    { value: "car_diesel", label: "Car (Diesel)", co2Factor: 0.18 },
    { value: "two_wheeler", label: "Two Wheeler", co2Factor: 0.09 },
    { value: "walking", label: "Walking/Cycling", co2Factor: 0 },
  ]},
  { id: "electricity", label: "Monthly Electricity", unit: "kWh" },
  { id: "flights", label: "Flights per Year", unit: "trips" },
  { id: "diet", label: "Dietary Preference", options: [
    { value: "meat_daily", label: "Meat Daily", co2Factor: 3.3 },
    { value: "meat_weekly", label: "Meat Weekly", co2Factor: 2.5 },
    { value: "vegetarian", label: "Vegetarian", co2Factor: 1.7 },
    { value: "vegan", label: "Vegan", co2Factor: 1.5 },
  ]},
];
