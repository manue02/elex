import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedienteModalComponent } from './expediente-modal.component';

describe('ExpedienteModalComponent', () => {
  let component: ExpedienteModalComponent;
  let fixture: ComponentFixture<ExpedienteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpedienteModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpedienteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
