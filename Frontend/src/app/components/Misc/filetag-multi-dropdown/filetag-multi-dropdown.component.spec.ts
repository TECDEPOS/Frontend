import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiletagMultiDropdownComponent } from './filetag-multi-dropdown.component';

describe('FiletagMultiDropdownComponent', () => {
  let component: FiletagMultiDropdownComponent;
  let fixture: ComponentFixture<FiletagMultiDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiletagMultiDropdownComponent]
    });
    fixture = TestBed.createComponent(FiletagMultiDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
