import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordExpiredPopupComponent } from './password-expired-popup.component';

describe('PasswordExpiredPopupComponent', () => {
  let component: PasswordExpiredPopupComponent;
  let fixture: ComponentFixture<PasswordExpiredPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasswordExpiredPopupComponent]
    });
    fixture = TestBed.createComponent(PasswordExpiredPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
