import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { StationData } from '../interfaces/weather';

@Injectable({
  providedIn: 'root',
})
export class Weather {
  private baseUrl = 'https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station';

  constructor(private http: HttpClient) {}

  getStationData(stationId: number, period: string): Observable<StationData> {
    return this.http.get<any>(`${this.baseUrl}/${stationId}/period/${period}/data.json`).pipe(
      map((data) => ({
        stationName: data.station.name,
        values: data.value.map((item: { date: number; value: string }) => ({
          timestamp: item.date,
          value: parseFloat(item.value),
        })),
      })),
    );
  }

  getSeveralStationData(stations: number[], period: string): Observable<StationData[]> {
    return forkJoin(stations.map((stationId) => this.getStationData(stationId, period)));
  }
}
