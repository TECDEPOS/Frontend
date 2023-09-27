import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonmodulePopupComponent } from './add-personmodule-popup.component';

describe('AddPersonmodulePopupComponent', () => {
  let component: AddPersonmodulePopupComponent;
  let fixture: ComponentFixture<AddPersonmodulePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPersonmodulePopupComponent]
    });
    fixture = TestBed.createComponent(AddPersonmodulePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
