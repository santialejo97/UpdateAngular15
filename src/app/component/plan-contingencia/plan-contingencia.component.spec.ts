import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanContingenciaComponent } from './plan-contingencia.component';

describe('PlanContingenciaComponent', () => {
  let component: PlanContingenciaComponent;
  let fixture: ComponentFixture<PlanContingenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanContingenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanContingenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
