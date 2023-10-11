import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPersonmodulePopupComponent } from './edit-personmodule-popup.component';

describe('EditPersonmodulePopupComponent', () => {
  let component: EditPersonmodulePopupComponent;
  let fixture: ComponentFixture<EditPersonmodulePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPersonmodulePopupComponent]
    });
    fixture = TestBed.createComponent(EditPersonmodulePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
