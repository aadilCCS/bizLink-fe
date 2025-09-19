import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgDateTimePickerComponent } from './ng-date-time-picker.component';

describe('NgDateTimePickerComponent', () => {
  let component: NgDateTimePickerComponent;
  let fixture: ComponentFixture<NgDateTimePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgDateTimePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgDateTimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
