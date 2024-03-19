import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImprimirIncapacidadComponent } from './imprimir-incapacidad.component';

describe('ImprimirIncapacidadComponent', () => {
  let component: ImprimirIncapacidadComponent;
  let fixture: ComponentFixture<ImprimirIncapacidadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImprimirIncapacidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprimirIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
