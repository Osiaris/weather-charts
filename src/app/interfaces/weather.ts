export interface WeatherData {
  timestamp: number;
  value: number;
}

export interface StationData {
  stationName: string;
  values: WeatherData[];
}
