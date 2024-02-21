import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnackbarIndicatorComponent } from './snackbar-indicator.component';

describe('SnackbarIndicatorComponent', () => {
  let component: SnackbarIndicatorComponent;
  let fixture: ComponentFixture<SnackbarIndicatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SnackbarIndicatorComponent]
    });
    fixture = TestBed.createComponent(SnackbarIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
