import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonCourseComponent } from './add-person-course.component';

describe('AddPersonCourseComponent', () => {
  let component: AddPersonCourseComponent;
  let fixture: ComponentFixture<AddPersonCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPersonCourseComponent]
    });
    fixture = TestBed.createComponent(AddPersonCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
