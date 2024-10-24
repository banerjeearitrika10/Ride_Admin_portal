import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-booking-details',
  templateUrl: './booking-details.component.html',
  styleUrl: './booking-details.component.scss'
})
export class BookingDetailsComponent {
  bookingFormValue!:any;
  mode!:any;
  constructor(private location: Location) {
     this.bookingFormValue=location.getState();
  }
  ngOnInit():void{
    this.mode = this.bookingFormValue.mode;
    this.bookingFormValue = this.bookingFormValue.data;
    console.log(this.bookingFormValue);
    
  }
}
