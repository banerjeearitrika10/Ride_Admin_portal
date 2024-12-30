import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDetailDialogComponent } from './car-detail-dialog.component';

describe('CarDetailDialogComponent', () => {
  let component: CarDetailDialogComponent;
  let fixture: ComponentFixture<CarDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
