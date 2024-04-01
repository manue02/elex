import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActuacionesModalComponent } from './actuaciones-modal.component';

describe('ActuacionesModalComponent', () => {
  let component: ActuacionesModalComponent;
  let fixture: ComponentFixture<ActuacionesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActuacionesModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActuacionesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
