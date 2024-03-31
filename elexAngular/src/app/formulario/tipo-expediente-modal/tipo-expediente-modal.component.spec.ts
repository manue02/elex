import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoExpedienteModalComponent } from './tipo-expediente-modal.component';

describe('TipoExpedienteModalComponent', () => {
  let component: TipoExpedienteModalComponent;
  let fixture: ComponentFixture<TipoExpedienteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TipoExpedienteModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipoExpedienteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
