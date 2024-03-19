import { TestBed } from '@angular/core/testing';

import { ValidarUsuarioService } from './validar-usuario.service';

describe('ValidarUsuarioService', () => {
  let service: ValidarUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidarUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
