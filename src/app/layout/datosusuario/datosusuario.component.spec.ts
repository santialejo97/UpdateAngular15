import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatosusuarioComponent } from './datosusuario.component';

describe('DatosusuarioComponent', () => {
  let component: DatosusuarioComponent;
  let fixture: ComponentFixture<DatosusuarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosusuarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosusuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
