import { TestBed } from '@angular/core/testing';

import { PersonCourseService } from './person-course.service';

describe('PersonCourseService', () => {
  let service: PersonCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
