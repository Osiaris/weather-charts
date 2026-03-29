import { Comparison } from './comparison/comparison';
import { WeatherHistory } from './weather-history/weather-history';
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'weather-history', pathMatch: 'full' },
  { path: 'weather-history', component: WeatherHistory },
  { path: 'comparison', component: Comparison },
];
