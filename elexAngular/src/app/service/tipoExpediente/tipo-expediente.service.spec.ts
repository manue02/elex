import { TestBed } from '@angular/core/testing';

import { TipoExpedienteService } from './tipo-expediente.service';

describe('TipoExpedienteService', () => {
  let service: TipoExpedienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoExpedienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
