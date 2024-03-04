import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCourseToModuleComponent } from './add-course-to-module.component';

describe('AddCourseToModuleComponent', () => {
  let component: AddCourseToModuleComponent;
  let fixture: ComponentFixture<AddCourseToModuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddCourseToModuleComponent]
    });
    fixture = TestBed.createComponent(AddCourseToModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
