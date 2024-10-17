import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OnBehalfBookingFormComponent } from './on-behalf-booking-form.component';

describe('OnBehalfBookingFormComponent', () => {
  let component: OnBehalfBookingFormComponent;
  let fixture: ComponentFixture<OnBehalfBookingFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnBehalfBookingFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OnBehalfBookingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
