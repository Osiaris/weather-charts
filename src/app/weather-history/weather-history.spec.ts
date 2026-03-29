import { WeatherHistory } from './weather-history';
import { WeatherData } from '../interfaces/weather';

describe('WeatherHistory', () => {
  let component: WeatherHistory;

  beforeEach(() => {
    // Create a minimal instance — just enough to test filterData
    component = new WeatherHistory(null as any, null as any, null as any, null as any);
  });

  describe('filterData', () => {
    it('should return all data when period is latest-months', () => {
      component.selectedPeriod = 'latest-months';
      const data: WeatherData[] = [
        { timestamp: 1000, value: 5 },
        { timestamp: 2000, value: 10 },
      ];
      expect(component.filterData(data)).toEqual(data);
    });

    it('should filter to last 24 hours when period is 1', () => {
      component.selectedPeriod = '1';
      const now = Date.now();
      const data: WeatherData[] = [
        { timestamp: now - 2 * 24 * 60 * 60 * 1000, value: 5 }, // 2 days ago — excluded
        { timestamp: now - 12 * 60 * 60 * 1000, value: 10 }, // 12 hours ago — included
        { timestamp: now - 1000, value: 15 }, // just now — included
      ];
      const result = component.filterData(data);
      expect(result.length).toBe(2);
      expect(result[0].value).toBe(10);
      expect(result[1].value).toBe(15);
    });

    it('should filter to last 7 days when period is 7', () => {
      component.selectedPeriod = '7';
      const now = Date.now();
      const data: WeatherData[] = [
        { timestamp: now - 10 * 24 * 60 * 60 * 1000, value: 1 }, // 10 days ago — excluded
        { timestamp: now - 5 * 24 * 60 * 60 * 1000, value: 2 }, // 5 days ago — included
        { timestamp: now - 1000, value: 3 }, // just now — included
      ];
      const result = component.filterData(data);
      expect(result.length).toBe(2);
      expect(result[0].value).toBe(2);
      expect(result[1].value).toBe(3);
    });

    it('should filter to last 30 days when period is 30', () => {
      component.selectedPeriod = '30';
      const now = Date.now();
      const data: WeatherData[] = [
        { timestamp: now - 60 * 24 * 60 * 60 * 1000, value: 1 }, // 60 days ago — excluded
        { timestamp: now - 15 * 24 * 60 * 60 * 1000, value: 2 }, // 15 days ago — included
      ];
      const result = component.filterData(data);
      expect(result.length).toBe(1);
      expect(result[0].value).toBe(2);
    });

    it('should return empty array when all data is outside the period', () => {
      component.selectedPeriod = '1';
      const now = Date.now();
      const data: WeatherData[] = [
        { timestamp: now - 5 * 24 * 60 * 60 * 1000, value: 1 },
        { timestamp: now - 3 * 24 * 60 * 60 * 1000, value: 2 },
      ];
      const result = component.filterData(data);
      expect(result.length).toBe(0);
    });
  });
});
