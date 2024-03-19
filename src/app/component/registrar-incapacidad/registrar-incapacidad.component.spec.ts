import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegistrarIncapacidadComponent } from './registrar-incapacidad.component';

describe('RegistrarIncapacidadComponent', () => {
  let component: RegistrarIncapacidadComponent;
  let fixture: ComponentFixture<RegistrarIncapacidadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarIncapacidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
