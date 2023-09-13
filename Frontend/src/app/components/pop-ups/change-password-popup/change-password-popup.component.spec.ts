import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordPopupComponent } from './change-password-popup.component';

describe('ChangePasswordPopupComponent', () => {
  let component: ChangePasswordPopupComponent;
  let fixture: ComponentFixture<ChangePasswordPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePasswordPopupComponent]
    });
    fixture = TestBed.createComponent(ChangePasswordPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
