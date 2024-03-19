import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalListaDiagnosticoComponent } from './modal-lista-diagnostico.component';

describe('ModalListaDiagnosticoComponent', () => {
  let component: ModalListaDiagnosticoComponent;
  let fixture: ComponentFixture<ModalListaDiagnosticoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalListaDiagnosticoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalListaDiagnosticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
