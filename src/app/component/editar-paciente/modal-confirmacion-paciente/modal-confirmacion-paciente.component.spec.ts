import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalConfirmacionPacienteComponent } from './modal-confirmacion-paciente.component';

describe('ModalConfirmacionPacienteComponent', () => {
  let component: ModalConfirmacionPacienteComponent;
  let fixture: ComponentFixture<ModalConfirmacionPacienteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmacionPacienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmacionPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
