import { Component, ElementRef, Input, NgZone, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-on-behalf-booking-form',
  templateUrl: './on-behalf-booking-form.component.html',
  styleUrls: ['./on-behalf-booking-form.component.scss'],
})
export class OnBehalfBookingFormComponent  implements OnInit {
    @Input() bookingFormValue!:any;
    @Input() mode!:any;
    @Input() userDetails!:any;
    @Input() isApprove:boolean = false;
    @ViewChild('autocomplete') autocompleteInput!: ElementRef<HTMLInputElement>;
    private autocomplete!: google.maps.places.Autocomplete;
    // @ViewChildren('googleAutocomplete') googleAutocompleteInputs!: QueryList<ElementRef<HTMLInputElement>>;
    @ViewChildren('googleAutocomplete') autocompleteInputs!: QueryList<ElementRef>;
    private autocompleteInstances: Map<number, google.maps.places.Autocomplete> = new Map();
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
    isBookingWeekly: boolean = false;
    weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    bookingPerson:any=[
      { label: 'Internal Employee', value: 'INTERNAL_EMPLOYEE' },
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
        id:"Dz",
        name: 'Dzire (4 + 1 persons)',
        cost: 120,
      },
      {
        id:"Al",
        name: 'Altis (4 + 1 persons) ',
        cost: 300,
      },
      {
        id:"In",
        name: 'Innova Crysta (5 +1  persons) ',
        cost: 250,
      },
      {
        id:"Fo",
        name: 'Fortuner (5 +1  persons) ',
        cost: 600,
      },
      {
        id:"Ho",
        name: 'Honda City (4 +1  persons)',
        cost: 170,
      },
      {
        id:"Me",
        name: 'Mercedes (4 +1  persons)',
        cost: 1000,
      },
      {
        id:"Er",
        name: 'Ertiga (5 + 1 persons) ',
        cost: 900,
      },
      {
        id:"wi",
        name: 'Winger (13 + 1 seater) ',
        cost: 500,
      },
      {
        id:"Tr",
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
    constructor(public fb: FormBuilder,private ngZone: NgZone) { }
  
    ngOnInit(): void {
      console.log(this.bookingFormValue);
      
      this.initiateForm();
      this.bookingForm.get('bookingReportDto.carRepeatTillDate')?.valueChanges.subscribe((selectedDate: Date) => {
        this.onRepeateDateSelected();
      });
      this.bookingForm.controls['carReportingDatetime'].valueChanges.subscribe((selectedDate: Date) => {
        this.onReportingDateSelected();
      });
     if(this.mode == 'view'){
      this.bookingForm.get('raisedBy.employee_name')?.disable();
      this.bookingForm.get('raisedBy.employee_contactNo')?.disable();
      this.bookingForm.get('raisedBy.employee_dept')?.disable();
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
          console.log(new Date(this.bookingFormValue.repeatDate));//Important
          
          this.bookingFormValue.bookingLocationMap.forEach(element => {
            if(this.bookingFormValue.bookingLocationMap.length>this.bookingLocationMap.length){
              this.bookingForm.controls['numCarsRequired'].patchValue(this.bookingForm.controls['numCarsRequired'].value + 1)
              this.addCarDetails();
            }
          });
          this.bookingForm.patchValue(this.bookingFormValue);
          this.onChangeBookingPreference();
          this.onSelectCar();
          this.minDate = this.bookingForm.controls['carReportingDatetime'].value;
          this.maxDate = this.addDaysToDate(this.minDate);
          this.searchTerm=this.bookingFormValue?.riderName;
          if(this.bookingForm.get('bookingReportDto.carRepeatTillDate')?.value){
            this.onRepeateDateSelected();
          }
        }
        console.log(this.mode);
        
        if(this.mode == 'view'){
          this.bookingForm.disable();
        }
    }
    ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
    }
    ngAfterViewInit(): void {
      const input = this.autocompleteInput.nativeElement;
  
      if (!input) {
        console.error('Autocomplete input element not found');
        return;
      }
  
      this.autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['geocode'],
        componentRestrictions: {country: "IN"} 
      });
      this.autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = this.autocomplete.getPlace();
  
          if (place.geometry) {
            console.log('Selected Place Details:', place);
          } else {
            console.warn('No details available for input:', place.name);
          }
        });
      });
      this.initAutocomplete();
    }
    initAutocomplete(): void {

        
      this.autocompleteInputs.forEach((inputRef, index) => {
        if (this.autocompleteInstances.has(index)) return; // Skip already initialized inputs
  
        const input = inputRef.nativeElement;
        const options = {
          types: ['geocode'],
          componentRestrictions: { country: 'IN' }, // Customize as needed
        };
  
        const autocomplete = new google.maps.places.Autocomplete(input, options);
  
        // Add event listener for place_changed
        autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
            if (place.geometry) {
              console.log(`Destination ${index + 1} Selected:`, place);
              // Update the FormArray with the selected place's formatted address
              this.destination.at(index).setValue(place.formatted_address || '');
            } else {
              console.warn(`No details available for input: ${input.value}`);
            }
          });
        });
  
        // Store the Autocomplete instance
        this.autocompleteInstances.set(index, autocomplete);
      });
      }
      realignAutocompleteInstances(): void {
        const updatedInstances = new Map<number, google.maps.places.Autocomplete>();
        Array.from(this.autocompleteInstances.entries()).forEach(([oldIndex, instance], newIndex) => {
          updatedInstances.set(newIndex, instance);
        });
        this.autocompleteInstances = updatedInstances;
      }
    initiateForm() {
      this.bookingForm = this.fb.group({
        raisedBy: this.fb.group({
          employee_name:[null],
          employee_contactNo:[null],
          employee_emailId:[null],
          employee_dept:[null]
        }),
        raisedFor: this.fb.group({
          onbehalfType:['INTERNAL_EMPLOYEE'],
          onbehalfContactNo:[null],
          onbehalfName:[null],
          onbehalfDepartment:[null]
        }),
        carTypeId: ['',Validators.required],
        numPersonsTravelling: [1],
        numCarsRequired:[1],
        destination: this.fb.array([this.fb.control('', Validators.required)]),
        // bookingPreference: ['once'],
        locationType: ['LOCAL'],
        reportingLocation: ['same'],
        carReportingDatetime: [this.selectedDate,[Validators.required]],
        // carRequiredTillDatetime: [this.selectedDate],
        costCenterCode: [''],
        eventCode: [''],
        purpose: [null,Validators.required],
        bookingType:['SELF'],
        bookingLocationMap: this.fb.array([this.newCarDetails()]),
        bookingReportDto: this.fb.group({
          bookingPreference: ['ONCE'],
          excludeSunday: [true],
          excludeSaturday: [true],
          carRequiredTillDatetime: [this.selectedDate],
          carRepeatTillDate: [this.selectedDate],
          selectedDaysInaWeek: [],
        }),
        onbehalfEmployeeEmailId:[null],
        name:[null],
        contactNo:[null]
      });
    }
  
    get bookingLocationMap() {
      return this.bookingForm.get('bookingLocationMap') as FormArray;
    }
    addCarDetails() {
      this.bookingLocationMap.push(this.newCarDetails());
    }
    removeCarDetails(index: number) {
      this.bookingLocationMap.removeAt(index);
    }
    get destination() {
      return (this.bookingForm.get('destination') as FormArray);
    }
    addDestination() {
      const destinationArray = this.bookingForm.get('destination') as FormArray;
      destinationArray.push(this.fb.control('', Validators.required));
        setTimeout(()=>{
          this.initAutocomplete();
        },0)
    }
    removeDestination(index: number) {
      const destinationArray = this.bookingForm.get('destination') as FormArray;
      if (destinationArray.length > 1) {
        destinationArray.removeAt(index);
      }
      if (this.autocompleteInstances.has(index)) {
        this.autocompleteInstances.delete(index);
      }
      this.realignAutocompleteInstances();
    }
    newCarDetails() {
      return this.fb.group({
        contactName: [''],
        contactNumber: [''],
        carReleaseDatetime: [this.selectedDate],
        reportingAddress: [''],
        releaseAddress: [''],
      });
    }
    reinitializeFormArray() {
      const bookingLocationMap = this.bookingForm.get('bookingLocationMap') as FormArray;
      bookingLocationMap.clear();
      bookingLocationMap.push(this.newCarDetails());
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
      console.log(this.bookingForm.get('bookingReportDto.carRepeatTillDate')?.value);
      
        if(this.bookingForm.get('bookingReportDto.bookingPreference')?.value == 'DAILY'){
          this.ifhasSaturday = this.hasSaturday(
            this.bookingForm.controls['carReportingDatetime'].value,
            this.bookingForm.get('bookingReportDto.carRepeatTillDate')?.value
          );
          this.ifhasSunday = this.hasSunday(
            this.bookingForm.controls['carReportingDatetime'].value,
            this.bookingForm.get('bookingReportDto.carRepeatTillDate')?.value
          );
        }
      
    }
  
    onReportingDateSelected() {
      console.log(this.bookingForm.controls['carReportingDatetime'].value);
      
      (this.minDate =  this.bookingForm.controls['carReportingDatetime'].value),
      this.bookingForm.get('bookingReportDto.carRepeatTillDate')?.value;
    this.maxDate = this.addDaysToDate(this.minDate);
    this.bookingForm.get('bookingReportDto.carRepeatTillDate')?.patchValue(this.minDate);

    }
    async dismiss() {
      // await this.modalCtrl.dismiss();
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
    onSelectCar() {
      
      // this.costOfCar = this.carType.filter(
      //   (value: any) => value.name == event.value
      // )[0].cost;
      // this.bookingForm.controls['costOfCar'].patchValue(this.costOfCar);
      //console.log(this.carType.filter((value:any)=>value.name==event.detail.value));
      this.costOfCar = this.carType.filter(
        (value: any) => value.id == this.bookingForm.controls['carTypeId'].value
      )[0].cost;
    }
    increment() {
        if (this.bookingForm.controls['numCarsRequired'].value < this.bookingForm.controls['numPersonsTravelling'].value) {
          this.bookingForm.controls['numCarsRequired'].patchValue(this.bookingForm.controls['numCarsRequired'].value + 1);
          if (this.bookingForm.controls['reportingLocation'].value == 'different') {
            this.addCarDetails();
          }
        }
      }
      decrement() {
        if (this.bookingForm.controls['numCarsRequired'].value > 1) {
          this.bookingForm.controls['numCarsRequired'].patchValue(this.bookingForm.controls['numCarsRequired'].value - 1);;
    
          if (
            this.bookingLocationMap.length > 1 &&
            this.bookingForm.controls['reportingLocation'].value == 'different'
          ) {
            this.removeCarDetails(this.bookingLocationMap.length - 1);
          }
        }
      }
    onChangeReporting() {
      console.log(this.bookingForm.controls['reportingLocation'].value);
      if (this.bookingForm.controls['reportingLocation'].value == 'different') {
        if (this.bookingForm.controls['numCarsRequired'].value != this.bookingLocationMap.length) {
          for (let i = 0; i < this.bookingForm.controls['numCarsRequired'].value; i++) {
            if (this.bookingForm.controls['numCarsRequired'].value == this.bookingLocationMap.length) return;
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
      console.log(this.bookingForm.get('bookingReportDto.bookingPreference')?.value);
      
      if (this.bookingForm.get('bookingReportDto.bookingPreference')?.value == 'ONCE') {
        this.isBookingDaily = false;
        this.isBookingWeekly = false;
      } else if(this.bookingForm.get('bookingReportDto.bookingPreference')?.value == 'DAILY'){
        this.isBookingDaily = true;
        this.isBookingWeekly = false;
      }
      else{
        this.isBookingDaily = false;
        this.isBookingWeekly = true;
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
      // this.counterValue = 1;
      // this.costOfCar = 0;
      // this.ifhasSaturday = false;
      // this.ifhasSunday = false;
      // this.isBookingDaily = false;
      // this.bookingForm.reset({
      //   userName: this.userDetails?.name,
      //   locationType: 'LOCAL',
      //   bookingPreference: 'once',
      //   reportingLocation: 'same',
      //   repeatDate: this.selectedDate,
      //   reportingDate: this.selectedDate,
      //   requiredDate: this.selectedDate,
      // });
      this.reinitializeFormArray();
    }
   
    onSelectBookingPerson(){
      console.log(this.bookingForm.get('raisedFor.onbehalfType')?.value );
      
      if(this.bookingForm.get('raisedFor.onbehalfType')?.value == "INTERNAL"){

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

