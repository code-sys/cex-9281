import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroRangoFechasComponent } from './filtro-rango-fechas.component';

describe('FiltroRangoFechasComponent', () => {
  let component: FiltroRangoFechasComponent;
  let fixture: ComponentFixture<FiltroRangoFechasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltroRangoFechasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroRangoFechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
