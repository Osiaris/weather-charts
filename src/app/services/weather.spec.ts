import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Weather } from './weather';

describe('Weather Service', () => {
  let service: Weather;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(Weather);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should transform API response into StationData', () => {
    service.getStationData(127310, 'latest-months').subscribe((data) => {
      expect(data.stationName).toBe('Sundsvall');
      expect(data.values.length).toBe(2);
      expect(data.values[0]).toEqual({ timestamp: 1000, value: -5.2 });
      expect(data.values[1]).toEqual({ timestamp: 2000, value: 3.1 });
    });

    const req = httpMock.expectOne(
      'https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station/127310/period/latest-months/data.json',
    );
    expect(req.request.method).toBe('GET');

    req.flush({
      station: { name: 'Sundsvall' },
      value: [
        { date: 1000, value: '-5.2', quality: 'G' },
        { date: 2000, value: '3.1', quality: 'G' },
      ],
    });
  });

  it('should parse string values to floats', () => {
    service.getStationData(97400, 'latest-hour').subscribe((data) => {
      expect(data.values[0].value).toBe(12.5);
      expect(typeof data.values[0].value).toBe('number');
    });

    const req = httpMock.expectOne(
      'https://opendata-download-metobs.smhi.se/api/version/1.0/parameter/1/station/97400/period/latest-hour/data.json',
    );

    req.flush({
      station: { name: 'Stockholm' },
      value: [{ date: 3000, value: '12.5', quality: 'G' }],
    });
  });
});
