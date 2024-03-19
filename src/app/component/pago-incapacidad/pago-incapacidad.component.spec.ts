import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { pagoIncapacidadComponent } from './pago-incapacidad.component';

describe('pagoIncapacidadComponent', () => {
  let component: pagoIncapacidadComponent;
  let fixture: ComponentFixture<pagoIncapacidadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ pagoIncapacidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(pagoIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
