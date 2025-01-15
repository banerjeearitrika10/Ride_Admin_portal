import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { OnBehalfBookingFormComponent } from '../on-behalf-booking-form/on-behalf-booking-form.component';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-book-cab',
  templateUrl: './book-cab.component.html',
  styleUrl: './book-cab.component.scss'
})
export class BookCabComponent implements OnDestroy {
  private destroyed$ = new Subject<void>();
  @Input() isOpen: boolean = false;
  @Output() onCloseDrawer = new EventEmitter();
  @ViewChild(OnBehalfBookingFormComponent) OnBehalfBookingFormComponent!: OnBehalfBookingFormComponent;
  constructor(public bookingService : BookingService) {
 }
 ngOnInit():void{
   
 }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
 }

  doCloseDrawer() {
      this.isOpen = false;
      this.onCloseDrawer.emit();
  }
  onRequestRide(){
    console.log(this.OnBehalfBookingFormComponent.bookingForm.value);
    let payload = this.OnBehalfBookingFormComponent.bookingForm.value;
    payload.bookingReportDto.carReportingDatetime = new Date(payload.bookingReportDto.carReportingDatetime).toISOString();
    payload.bookingReportDto.carRequiredTillDatetime = new Date(payload.bookingReportDto.carRequiredTillDatetime).toISOString();
    payload.bookingReportDto.carRepeatTillDate = new Date(payload.bookingReportDto.carRepeatTillDate).toISOString();
    if(this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.bookingPreference == "WEEKLY"){
      let startdate = this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.carReportingDatetime;
      let enddate = this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.carRepeatTillDate;
      let weekDays = this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.selectedDaysInaWeek;
      let dateRange = this.getDatesInRangeForDays(startdate,enddate,weekDays);
      console.log(dateRange);
      payload.bookingReportDto.carRequiredTillDatetime = (payload.bookingReportDto.carRepeatTillDate)
      payload.bookingReportDto.carReportingDatetime = dateRange;
    }
    else if(this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.bookingPreference == "DAILY"){
      let startdate = this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.carReportingDatetime;
      let enddate = this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.carRepeatTillDate;
      let excludeSaturday = this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.excludeSaturday;
      let excludeSunday = this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.excludeSunday;
      let dateRange = this.getDatesInRangeWithExclusions(startdate,enddate,excludeSaturday,excludeSunday);
      console.log(dateRange);
      payload.bookingReportDto.carRequiredTillDatetime = (payload.bookingReportDto.carRepeatTillDate)
      payload.bookingReportDto.carReportingDatetime = dateRange
    }
    else{
      payload.bookingReportDto.carReportingDatetime = [payload.bookingReportDto.carReportingDatetime];
    }

    // else{
    //   console.log(payload.bookingReportDto.carReportingDatetime);
      
    //   const reportingDate = payload.bookingReportDto.carReportingDatetime;
    //   if (typeof reportingDate === 'string' && reportingDate.endsWith('Z')) {
    //     payload.bookingReportDto.carReportingDatetime = [reportingDate]; // Already in UTC format
    //   } else {
    //     payload.bookingReportDto.carReportingDatetime = [this.convertDateToExactISOString(reportingDate)];
    //   }
    //   payload.bookingReportDto.carRequiredTillDatetime =this.convertDateToExactISOString( payload.bookingReportDto.carRequiredTillDatetime);
    // }
    delete payload.bookingReportDto.carRepeatTillDate;
    delete payload.reportingLocation;
    // this.presentAlert("Booking should be done before 7pm");
    console.log(payload);
    
    this.bookingService.createBooking(payload).subscribe({
      next: (data:any)=>{
        console.log("responseData",data);
        
        this.doCloseDrawer();
        window.location.reload()
      },
      error: (err:any)=>{
        
      }
    })
  }
  convertDateToExactISOString(date:string): string {
    // Input date string
     const inputDate = new Date(date);
    
    // Get the components of the date
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(inputDate.getDate()).padStart(2, '0');
    const hours = String(inputDate.getHours()).padStart(2, '0');
    const minutes = String(inputDate.getMinutes()).padStart(2, '0');
    const seconds = String(inputDate.getSeconds()).padStart(2, '0');
    
    // Construct the ISO string without converting to UTC
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  }
  convertISOStringToFixedLocalDateTime(isoString:string): string {
    // Input ISO date string
    // Split the ISO string into date and time components
    const [datePart, timePart] = isoString.split("T");
    const [year, month, day] = datePart.split("-");
    const [hour, minute, second] = timePart.replace("Z", "").split(":");
  
    // Create a new Date object in local time with the same date and time
    const date = new Date(
      Number(year),
      Number(month) - 1, // JavaScript months are zero-indexed
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    );
  
    // Return the date as a string without altering the time
    return date.toString(); // Example: "Thu Jan 30 2025 08:00:00 GMT+0530 (India Standard Time)"
  }
  getDatesInRangeForDays(
    startDate: string, 
    endDate: string, 
    daysOfWeek: string[]
  ): string[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(start.getHours(), start.getMinutes(), start.getSeconds(), start.getMilliseconds());
    const dayMapping: { [key: string]: number } = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6
    };
    const targetDays = daysOfWeek.map(day => dayMapping[day]);
  
    const result: string[] = [];
    const current = new Date(start);
    while (current <= end) {
      if (targetDays.includes(current.getDay())) {
        result.push(current.toISOString());
      }
      current.setDate(current.getDate() + 1);
    }
  
    return result;
  }
  getDatesInRangeWithExclusions(
    startDateandTime: string,
    endDate: string,
    excludeSaturday: boolean,
    excludeSunday: boolean
  ): string[] {
    const start = new Date(startDateandTime);
    const end = new Date(endDate);
    end.setHours(start.getHours(), start.getMinutes(), start.getSeconds(), start.getMilliseconds())
    const result: string[] = [];
  
    let current = new Date(start);
    while (current <= end) {
      console.log(current);
      
      const dayOfWeek = current.getDay();
      if (
        !(excludeSaturday && dayOfWeek === 6) && 
        !(excludeSunday && dayOfWeek === 0)     
      ) {
        result.push(current.toISOString());
      }
  
      current.setDate(current.getDate() + 1); 
    }
  
    return result;
  }
}
