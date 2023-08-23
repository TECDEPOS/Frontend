import { TestBed } from '@angular/core/testing';

import { PersonModuleService } from './person-module.service';

describe('PersonModuleService', () => {
  let service: PersonModuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonModuleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
