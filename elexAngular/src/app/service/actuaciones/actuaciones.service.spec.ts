import { TestBed } from '@angular/core/testing';

import { ActuacionesService } from './actuaciones.service';

describe('ActuacionesService', () => {
  let service: ActuacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActuacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
