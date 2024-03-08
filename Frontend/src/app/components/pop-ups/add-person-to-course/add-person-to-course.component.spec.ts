import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonToCourseComponent } from './add-person-to-course.component';

describe('AddPersonToCourseComponent', () => {
  let component: AddPersonToCourseComponent;
  let fixture: ComponentFixture<AddPersonToCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPersonToCourseComponent]
    });
    fixture = TestBed.createComponent(AddPersonToCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
