import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConceptoRehabilitacionComponent } from './concepto-rehabilitacion.component';

describe('AnularIncapacidadComponent', () => {
  let component: ConceptoRehabilitacionComponent;
  let fixture: ComponentFixture<ConceptoRehabilitacionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ConceptoRehabilitacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptoRehabilitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
