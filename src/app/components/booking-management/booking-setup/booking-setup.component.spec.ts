import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSetupComponent } from './booking-setup.component';

describe('BookingSetupComponent', () => {
  let component: BookingSetupComponent;
  let fixture: ComponentFixture<BookingSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingSetupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
