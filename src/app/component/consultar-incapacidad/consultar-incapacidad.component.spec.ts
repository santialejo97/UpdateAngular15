import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsultarIncapacidadComponent } from './consultar-incapacidad.component';

describe('ConsultarIncapacidadComponent', () => {
  let component: ConsultarIncapacidadComponent;
  let fixture: ComponentFixture<ConsultarIncapacidadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarIncapacidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
