import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherHistory } from './weather-history';

describe('WeatherHistory', () => {
  let component: WeatherHistory;
  let fixture: ComponentFixture<WeatherHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
