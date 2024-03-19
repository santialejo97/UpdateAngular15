import { TestBed } from '@angular/core/testing';

import { ObtenerFuncionesService } from './obtener-funciones.service';

describe('ObtenerFuncionesService', () => {
  let service: ObtenerFuncionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObtenerFuncionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
