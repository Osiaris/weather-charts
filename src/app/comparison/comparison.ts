import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HighchartsChartComponent } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { stations } from '../general/stations';
import { Weather } from '../services/weather';
import { StationData } from '../interfaces/weather';

@Component({
  selector: 'app-comparison',
  imports: [HighchartsChartComponent],
  templateUrl: './comparison.html',
  styleUrl: './comparison.scss',
})
export class Comparison implements OnInit {
  chartOptions: Highcharts.Options | null = null;
  stations = stations;

  constructor(
    private weather: Weather,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.weather
      .getStationDataForStations(
        this.stations.map((station) => station.id),
        'latest-hour',
      )
      .subscribe((data) => {
        this.chartOptions = this.createChartOptions(data);
        this.cdr.detectChanges();
      });
  }

  createChartOptions(data: StationData[]): Highcharts.Options {
    return {
      chart: { type: 'column', backgroundColor: 'transparent' },
      title: { text: 'Current Temperature Comparison', style: { color: '#e4e4e4' } },
      xAxis: {
        type: 'category',
        labels: { style: { color: '#e4e4e4' } },
      },
      yAxis: {
        title: { text: 'Temperature (°C)', style: { color: '#e4e4e4' } },
        labels: { style: { color: '#e4e4e4' } },
        gridLineColor: '#2a2a4a',
      },
      series: [
        {
          type: 'column',
          name: 'Temperature',
          data: data.map((station) => ({
            name: station.stationName,
            y: station.values[station.values.length - 1].value,
          })),
        },
      ],
      tooltip: {
        valueSuffix: '°C',
        backgroundColor: '#1a1a2e',
        borderColor: '#2a2a4a',
        style: { color: '#e4e4e4' },
      },
      legend: { itemStyle: { color: '#e4e4e4' } },
      accessibility: { enabled: false },
      credits: { enabled: false },
    };
  }
}
