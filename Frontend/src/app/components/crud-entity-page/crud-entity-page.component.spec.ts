import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudEntityPageComponent } from './crud-entity-page.component';

describe('CrudEntityPageComponent', () => {
  let component: CrudEntityPageComponent;
  let fixture: ComponentFixture<CrudEntityPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrudEntityPageComponent]
    });
    fixture = TestBed.createComponent(CrudEntityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
