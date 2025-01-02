import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAllotmentDialogComponent } from './car-allotment-dialog.component';

describe('CarAllotmentDialogComponent', () => {
  let component: CarAllotmentDialogComponent;
  let fixture: ComponentFixture<CarAllotmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarAllotmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarAllotmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
