import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { OnBehalfBookingFormComponent } from '../on-behalf-booking-form/on-behalf-booking-form.component';

@Component({
  selector: 'app-book-cab',
  templateUrl: './book-cab.component.html',
  styleUrl: './book-cab.component.scss'
})
export class BookCabComponent {
  private destroyed$ = new Subject<void>();
  @Input() isOpen: boolean = false;
  @Output() onCloseDrawer = new EventEmitter();
  @ViewChild(OnBehalfBookingFormComponent) OnBehalfBookingFormComponent!: OnBehalfBookingFormComponent;
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
 }

  doCloseDrawer(state: string = '') {
      this.isOpen = false;
      this.onRequestRide()
      this.onCloseDrawer.emit(state);
  }
  onRequestRide() {
    console.log(this.OnBehalfBookingFormComponent.bookingForm.value);
    if(this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.bookingPreference == "WEEKLY"){
      let startdate = this.OnBehalfBookingFormComponent.bookingForm.value.carReportingDatetime;
      let enddate = this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.carRepeatTillDate;
      let weekDays = this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.selectedDaysInaWeek;
      let dateRange = this.getDatesInRangeForDays(startdate,enddate,weekDays);
      console.log(dateRange);
    }
    else if(this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.bookingPreference == "DAILY"){
      let startdate = this.OnBehalfBookingFormComponent.bookingForm.value.carReportingDatetime;
      let enddate = this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.carRepeatTillDate;
      let excludeSaturday = this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.excludeSaturday;
      let excludeSunday = this.OnBehalfBookingFormComponent.bookingForm.value.bookingReportDto.excludeSunday;
      let dateRange = this.getDatesInRangeWithExclusions(startdate,enddate,excludeSaturday,excludeSunday);
      console.log(dateRange);
    }
    console.log(new Date(this.OnBehalfBookingFormComponent.bookingForm.value.carReportingDatetime).toISOString());
    
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
