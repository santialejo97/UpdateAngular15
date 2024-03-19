import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalListaIncapacidadesAnterioresComponent } from './modal-lista-incapacidades-anteriores.component';


describe('ModalListaDiagnosticoComponent', () => {
  let component: ModalListaIncapacidadesAnterioresComponent;
  let fixture: ComponentFixture<ModalListaIncapacidadesAnterioresComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalListaIncapacidadesAnterioresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalListaIncapacidadesAnterioresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
