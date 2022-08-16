import { TestBed } from '@angular/core/testing';

import { DestroyService } from './destroy.service';

describe('DestroyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DestroyService = TestBed.get(DestroyService);
    expect(service).toBeTruthy();
  });
});
