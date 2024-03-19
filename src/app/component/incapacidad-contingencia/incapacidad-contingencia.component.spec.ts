import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncapacidadContingenciaComponent } from './incapacidad-contingencia.component';

describe('IncapacidadContingenciaComponent', () => {
  let component: IncapacidadContingenciaComponent;
  let fixture: ComponentFixture<IncapacidadContingenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncapacidadContingenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncapacidadContingenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
