import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileuploadPopupComponent } from './fileupload-popup.component';

describe('FileuploadPopupComponent', () => {
  let component: FileuploadPopupComponent;
  let fixture: ComponentFixture<FileuploadPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileuploadPopupComponent]
    });
    fixture = TestBed.createComponent(FileuploadPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
