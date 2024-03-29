import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoExpedienteComponent } from './tipo-expediente.component';

describe('TipoExpedienteComponent', () => {
  let component: TipoExpedienteComponent;
  let fixture: ComponentFixture<TipoExpedienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TipoExpedienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TipoExpedienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
