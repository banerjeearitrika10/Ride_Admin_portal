import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-on-behalf-booking-form',
  templateUrl: './on-behalf-booking-form.component.html',
  styleUrls: ['./on-behalf-booking-form.component.scss'],
})
export class OnBehalfBookingFormComponent  implements OnInit {
    @Input() bookingFormValue!:any;
    @Input() userDetails!:any;
    @Input() isApprove:boolean = false;
    private destroyed$ = new Subject<void>();
    bookingForm!: FormGroup;
    public today = new Date();
    selectedDate: any = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 0, 0, 0);
    isBookingDaily: boolean = false;
    ifhasSaturday: boolean = false;
    ifhasSunday: boolean = false;
    minDate!: any;
    maxDate!: any;
    costOfCar: number = 0;
    counterValue: number = 1;
    bookingPerson:any=[
      { label: 'Internal Employee', value: 'INTERNAL' },
      { label: 'External Guests', value: 'EXTERNAL' },
    ];
    department:any=[
      { label: 'Marketing', value: 'MARKETING' },
      { label: 'Sales', value: 'SALES' },
    ];
    employeeList:any=[
      {
        id:6787,
        name:"Sipra Roy"
      },
      {
        id:67909,
        name:"Kalyan Roy"
      }
    ]
    carType: any = [
      {
        name: 'Dzire (4 + 1 persons)',
        cost: 120,
      },
      {
        name: 'Altis (4 + 1 persons) ',
        cost: 300,
      },
      {
        name: 'Innova Crysta (5 +1  persons) ',
        cost: 250,
      },
      {
        name: 'Fortuner (5 +1  persons) ',
        cost: 600,
      },
      {
        name: 'Honda City (4 +1  persons)',
        cost: 170,
      },
      {
        name: 'Mercedes (4 +1  persons)',
        cost: 1000,
      },
      {
        name: 'Ertiga (5 + 1 persons) ',
        cost: 900,
      },
      {
        name: 'Winger (13 + 1 seater) ',
        cost: 500,
      },
      {
        name: 'Traveler (25 + 1 seater) ',
        cost: 2000,
      },
    ];
    travelLocation: any = [
      { label: 'Local ', value: 'LOCAL' },
      { label: 'Outstation', value: 'OUTSTATION' },
    ];
    searchTerm: string = '';
    filteredItems: string[] = [];
    items: string[] = ['John', 'Jane', 'Mike', 'Emily', 'Sophia', 'Michael'];
    showDropdown: boolean = false;
  isEmployee: boolean = true;
    constructor( 
      
      public fb: FormBuilder) { }
  
    ngOnInit(): void {
      this.initiateForm();
      this.bookingForm.controls['repeatDate'].valueChanges.subscribe((selectedDate: Date) => {
        this.onRepeateDateSelected();
      });
      this.bookingForm.controls['reportingDate'].valueChanges.subscribe((selectedDate: Date) => {
        this.onReportingDateSelected();
      });
      if(this.isApprove){
        this.bookingForm.controls['userName'].disable();
        this.bookingForm.controls['userNumber'].disable();
        this.bookingForm.controls['department'].disable();
      }
      // this.selectedDate = this.parseDateString(this.selectedDate);
      this.minDate = this.selectedDate;
      this.maxDate = this.addDaysToDate(this.minDate);
      // this.loginService
      //   .getUserDetails()
      //   .pipe(takeUntil(this.destroyed$))
      //   .subscribe((result) => {
      //     this.userDetail = result;
      //     console.log(this.userDetail);
      //   });
        if(this.bookingFormValue){
          this.bookingForm.patchValue(this.bookingFormValue);
        }
    }
    ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
    }
    initiateForm() {
      this.bookingForm = this.fb.group({
        userName: [this.userDetails?.name],
        userNumber: [null],
        department: [null],
        riderName: [null],
        riderNumber: [null],
        riderDepaetment: [''],
        carType: [''],
        costOfCar: [null],
        noPerson: [1],
        destination: [null],
        bookingPreference: ['once'],
        locationType: ['LOCAL'],
        reportingLocation: ['same'],
        bookingFor: ["INTERNAL"],
        repeatDate: ['',[Validators.required]],
        reportingDate: ['',[Validators.required]],
        requiredDate: ['',[Validators.required]],
        costCenter: [''],
        eventCode: [''],
        purpose: [null],
        carDetails: this.fb.array([this.newCarDetails()]),
      });
    }
  
    get carDetails() {
      return this.bookingForm.get('carDetails') as FormArray;
    }
    addCarDetails() {
      this.carDetails.push(this.newCarDetails());
    }
    removeCarDetails(index: number) {
      this.carDetails.removeAt(index);
    }
    newCarDetails() {
      return this.fb.group({
        contactName: [''],
        contactNumber: [''],
        releasedatetime: [''],
        addReporting: [''],
        addRelease: [''],
      });
    }
    reinitializeFormArray() {
      const carDetails = this.bookingForm.get('carDetails') as FormArray;
      carDetails.clear();
      carDetails.push(this.newCarDetails());
    }
  
    parseDateString(dateString: any) {
      const now = new Date(dateString);
      const indiaFormatter = new Intl.DateTimeFormat('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata',
      });
  
      // Format the date into an array
      const formattedParts = indiaFormatter.formatToParts(now);
  
      // Helper to extract the parts
      const getPart = (type: string) =>
        formattedParts.find((part) => part.type === type)?.value;
  
      // Extract the year, month, day, hour, and minute for ISO string
      const year = getPart('year');
      const month = getPart('month');
      const day = getPart('day');
      const hour = getPart('hour');
      const minute = getPart('minute');
  
      // Format it as an ISO string without timezone
      return `${year}-${month}-${day}T${hour}:${minute}`;
    }
    onRepeateDateSelected() {
      console.log(this.bookingForm.controls['reportingDate'].value,
      this.bookingForm.controls['repeatDate'].value);
      
      this.ifhasSaturday = this.hasSaturday(
        this.bookingForm.controls['reportingDate'].value,
        this.bookingForm.controls['repeatDate'].value
      );
      this.ifhasSunday = this.hasSunday(
        this.bookingForm.controls['reportingDate'].value,
        this.bookingForm.controls['repeatDate'].value
      );
      this.dismiss();
    }
    async dismiss() {
      // await this.modalCtrl.dismiss();
    }
    onReportingDateSelected() {
      this.minDate = this.bookingForm.controls['reportingDate'].value;
      this.maxDate = this.addDaysToDate(this.minDate);
      console.log(this.minDate);
      
      this.bookingForm.controls['repeatDate'].patchValue(this.minDate);
      this.dismiss();
    }
    addDaysToDate(dateString: string) {
      const date = new Date(dateString);
      date.setDate(date.getDate() + 10);
      return date;
    }
    hasSaturday(startDate: any, endDate: any) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        throw new Error('Start date should be before or equal to end date');
      }
      let currentDate = start;
      while (currentDate <= end) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 6) {  // Check if the current day is Saturday (6 is Saturday)
          return true; // Saturday found
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }if (end.getDay() === 6) {
        return true;
      }
      return false;
    }
    hasSunday(startDate: any, endDate: any) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        throw new Error('Start date should be before or equal to end date');
      }
      let currentDate = start;
      while (currentDate <= end) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek === 0) { 
          return true; 
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }if (end.getDay() === 0) {
        return true;
      }
      return false;
    }
    convertToReadableDate(isoString: string) {
      // Create a new Date object from the ISO string
      const date = new Date(isoString);
  
      // Define options for formatting
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short', // Short month name, like "Aug"
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // Use 12-hour format with AM/PM
      };
  
      // Convert to a readable format using toLocaleDateString
      return date.toLocaleDateString('en-US', options);
    }
    onSelectCar(event: any) {
      console.log("this.costOfCar",event);
      
      this.costOfCar = this.carType.filter(
        (value: any) => value.name == event.value
      )[0].cost;
      //console.log(this.carType.filter((value:any)=>value.name==event.detail.value));
    }
    increment() {
      if (this.counterValue < 10) {
        this.counterValue++;
        if (this.bookingForm.controls['reportingLocation'].value == 'different') {
          this.addCarDetails();
        }
      }
    }
    decrement() {
      if (this.counterValue > 1) {
        this.counterValue--;
  
        if (
          this.carDetails.length > 1 &&
          this.bookingForm.controls['reportingLocation'].value == 'different'
        ) {
          this.removeCarDetails(this.carDetails.length - 1);
        }
      }
    }
    onChangeReporting() {
      console.log(this.bookingForm.controls['reportingLocation'].value);
      if (this.bookingForm.controls['reportingLocation'].value == 'different') {
        if (this.counterValue != this.carDetails.length) {
          for (let i = 0; i < this.counterValue; i++) {
            if (this.counterValue == this.carDetails.length) return;
            this.addCarDetails();
          }
        }
      } else {
        this.reinitializeFormArray();
      }
    }
    onChangeBookingPreference() {
      this.ifhasSaturday = false;
      this.ifhasSunday = false;
      if (this.bookingForm.controls['bookingPreference'].value == 'once') {
        this.isBookingDaily = false;
      } else {
        this.isBookingDaily = true;
      }
    }
    onDateSelected() {
      // Dismiss the datetime modal immediately after selection
      this.dismiss(); // Alternatively, you can use this.datetime?.dismiss();
    }
    onExcludeSaturday(event: any) {
      console.log(event.detail.checked);
    }
    onExcludeSunday(event: any) {
      console.log(event.detail.checked);
    }
    cancelBookingForm() {
      this.counterValue = 1;
      this.costOfCar = 0;
      this.ifhasSaturday = false;
      this.ifhasSunday = false;
      this.isBookingDaily = false;
      this.bookingForm.reset({
        userName: this.userDetails?.name,
        locationType: 'LOCAL',
        bookingPreference: 'once',
        reportingLocation: 'same',
        repeatDate: this.selectedDate,
        reportingDate: this.selectedDate,
        requiredDate: this.selectedDate,
      });
      this.reinitializeFormArray();
    }
   
    onSelectBookingPerson(){
      console.log(this.bookingForm.controls['bookingFor'].value );
      
      if(this.bookingForm.controls['bookingFor'].value == "INTERNAL"){

        this.isEmployee = true;
      }
      else{
        this.isEmployee = false;
      }

    }
    onSelectDepartmentRider(){

    }
   // Filter items based on the search term input
  filterItems(event: any) {
    console.log(event);
    
    const searchValue = event.target.value.toLowerCase();

    // Filter the list based on the search input
    if (searchValue && searchValue.trim() !== '') {
      this.filteredItems = this.items.filter(item => item.toLowerCase().includes(searchValue));
      this.showDropdown = true; // Show the dropdown
    } else {
      this.filteredItems = [];
      this.showDropdown = false; // Hide the dropdown if input is empty
    }
  }

  // Select an item from the dropdown
  selectItem(item: string) {
    this.searchTerm = item; // Set the selected item as the input value
    this.filteredItems = []; // Clear the dropdown
    this.showDropdown = false; // Hide the dropdown after selection
  }
  hideDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 150); // Add a small delay to allow item click before hiding the dropdown
  }
}

