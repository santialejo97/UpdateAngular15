import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AnularIncapacidadComponent } from './anular-incapacidad.component';

describe('AnularIncapacidadComponent', () => {
  let component: AnularIncapacidadComponent;
  let fixture: ComponentFixture<AnularIncapacidadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnularIncapacidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnularIncapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
