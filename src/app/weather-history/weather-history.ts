import { Component } from '@angular/core';
import { Weather } from '../services/weather';
import { OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HighchartsChartComponent } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { WeatherData, StationData } from '../interfaces/weather';
import { stations } from '../general/stations';

@Component({
  selector: 'app-weather-history',
  imports: [HighchartsChartComponent, FormsModule],
  templateUrl: './weather-history.html',
  styleUrl: './weather-history.scss',
})
export class WeatherHistory implements OnInit {
  chartOptions: Highcharts.Options | null = null;
  stations = stations;
  selectedStation = 127310;
  selectedPeriod = 'latest-months';
  allData: WeatherData[] = [];
  loadedData: WeatherData[] = [];
  error: string | null = null;
  cutoffTimeInMillis: number = 1000 * 60 * 5; // 5 minutes

  constructor(
    private weather: Weather,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    if (params['station']) this.selectedStation = Number(params['station']);
    if (params['period']) this.selectedPeriod = params['period'];
    this.updateDataFromServer();
  }
  updateUrlParams() {
    this.router.navigate([], {
      queryParams: { station: this.selectedStation, period: this.selectedPeriod },
      replaceUrl: true, // don't add to browser history
      queryParamsHandling: '', // replace all params
    });
  }
  dataIsFresh() {
    const lastFetch = sessionStorage.getItem('lastFetch');
    if (lastFetch && Date.now() - Number(lastFetch) < this.cutoffTimeInMillis) {
      return true;
    }
    return false;
  }

  filterData(data: WeatherData[]) {
    if (this.selectedPeriod === 'latest-months') return data;

    const cutoff = Date.now() - Number(this.selectedPeriod) * 24 * 60 * 60 * 1000;

    return data.filter((item) => item.timestamp > cutoff);
  }

  onStationChange() {
    if (isNaN(this.selectedStation)) return;
    this.updateDataFromServer();
    this.updateUrlParams();
  }

  onPeriodChange() {
    if (!this.dataIsFresh()) {
      this.updateDataFromServer(); // this will filter after fetching
    } else {
      this.loadedData = this.filterData(this.allData);
      this.chartOptions = this.createChartOptions(this.loadedData);
      this.cdr.detectChanges();
    }
    this.updateUrlParams();
  }

  updateDataFromServer() {
    const stationAtRequest = this.selectedStation;

    this.weather.getStationData(this.selectedStation, 'latest-months').subscribe({
      next: (stationData) => {
        sessionStorage.setItem('lastFetch', Date.now().toString());
        if (this.selectedStation !== stationAtRequest) return; // stale response guard, don't update the chart
        this.allData = stationData.values;
        this.loadedData = this.filterData(this.allData);
        this.chartOptions = this.createChartOptions(this.loadedData);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Error fetching data from server';
        this.cdr.detectChanges();
      },
    });
  }
  createChartOptions(data: WeatherData[]): Highcharts.Options {
    return {
      title: { text: 'Temperature', style: { color: '#e4e4e4' } },
      chart: {
        backgroundColor: 'transparent',
        borderColor: '#2a2a4a',
      },
      series: [
        {
          type: 'line',
          name: 'Temperature', // Set the series name so tooltip uses it
          data: data.map((item) => [item.timestamp, item.value]),
        },
      ],
      xAxis: {
        type: 'datetime',
        labels: { style: { color: '#e4e4e4' } },
        gridLineColor: '#2a2a4a',
        title: { text: 'Time', style: { color: '#e4e4e4' } },
      },
      yAxis: {
        title: { text: 'Temperature (°C)', style: { color: '#e4e4e4' } },
        labels: { style: { color: '#e4e4e4' } },
        gridLineColor: '#2a2a4a',
      },
      tooltip: {
        valueSuffix: '°C',
        backgroundColor: '#1a1a2e',
        borderColor: '#2a2a4a',
        style: { color: '#e4e4e4' },
      },
      accessibility: {
        enabled: false,
      },
      legend: {
        itemStyle: { color: '#e4e4e4', textDecoration: 'underline' },
        itemHoverStyle: { color: '#e4e4e4', textDecoration: 'none' },
      },
      credits: { enabled: false },
    };
  }
}
