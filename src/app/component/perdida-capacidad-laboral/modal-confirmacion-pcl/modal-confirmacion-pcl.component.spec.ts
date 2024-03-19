import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalConfirmacionPCLComponent } from './modal-confirmacion-pcl.component';

describe('ModalConfirmacionPCLComponent', () => {
  let component: ModalConfirmacionPCLComponent;
  let fixture: ComponentFixture<ModalConfirmacionPCLComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmacionPCLComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmacionPCLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
