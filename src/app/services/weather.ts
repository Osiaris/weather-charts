import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { WeatherData, StationData } from '../interfaces/weather';

@Injectable({
  providedIn: 'root',
})
export class Weather {
  private baseUrl =
    'https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station';

  constructor(private http: HttpClient) {}

  getTemperature(stationId: number, period: string): Observable<WeatherData[]> {
    return this.http
      .get<any>(`${this.baseUrl}/${stationId}/period/${period}/data.json`)
      .pipe(
        map((data) =>
          data.value.map((item: { date: number; value: string }) => ({
            timestamp: item.date,
            value: parseFloat(item.value),
          })),
        ),
      );
  }

  getStationData(stationId: number, period: string): Observable<StationData> {
    return this.http
      .get<any>(`${this.baseUrl}/${stationId}/period/${period}/data.json`)
      .pipe(
        map((data) => ({
          stationName: data.station.name,
          values: data.value.map((item: { date: number; value: string }) => ({
            timestamp: item.date,
            value: parseFloat(item.value),
          })),
        })),
      );
  }

  getStationDataForStations(
    stations: number[],
    period: string,
  ): Observable<StationData[]> {
    return forkJoin(
      stations.map((stationId) => this.getStationData(stationId, period)),
    );
  }
}
