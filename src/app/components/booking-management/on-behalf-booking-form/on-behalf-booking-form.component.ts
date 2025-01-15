import { Component, ElementRef, Input, NgZone, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, forkJoin, takeUntil } from 'rxjs';
import { BookingService } from '../../services/booking.service';
import { MasterService } from '../../services/master.service';
import { ICarType, IDepartment, IEvent } from '../../services/models/master-data';

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
    // @ViewChild('autocomplete') autocompleteReportingInput!: ElementRef<HTMLInputElement>;
    // private autocompleteReporting!: google.maps.places.Autocomplete;
    @ViewChildren('autocomplete') autocompleteReportingInput!: QueryList<ElementRef>;
    private autocompleteReporting: Map<number, google.maps.places.Autocomplete> = new Map();
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
      { label: 'External Guests', value: 'EXTERNAL_GUEST' },
    ];
    carType!: ICarType[];
    travelLocation: any = [
      { label: 'Local ', value: 'LOCAL' },
      { label: 'Outstation', value: 'OUTSTATION' },
    ];
    searchTerm: string = '';
    filteredItems: string[] = [];
    items: string[] = ['John', 'Jane', 'Mike', 'Emily', 'Sophia', 'Michael'];
    showDropdown: boolean = false;
  isEmployee: boolean = true;
  employeeDetails!: any;
  costCenterList:any = [];
  departmentList!:IDepartment[];
  eventList!:IEvent[];
  isOnbehalf: boolean = true;
    constructor(public fb: FormBuilder,
      private ngZone: NgZone,
      public bookingService:BookingService,
      public masterService:MasterService) { }
  
    ngOnInit(): void {
      console.log(this.bookingFormValue);
      let detail:any = localStorage.getItem('empDetails');
      // this.employeeDetails = JSON.parse(detail); 
      // console.log(this.employeeDetails);
      this.getEmployeeDetails();
      
      // this.costCenterList = this.employeeDetails?.costCenter;
      
      if(this.bookingFormValue){
        this.initiateForm();
        this.loadDataAndInitializeForm();
      }
      else{
        this.getAllDepartment();
        this.getAllCarType();
        this.initiateForm();
      }
      this.bookingForm.get('bookingReportDto.carRepeatTillDate')?.valueChanges.subscribe((selectedDate: Date) => {
        this.onRepeateDateSelected();
      });
      this.bookingForm.get('bookingReportDto.carReportingDatetime')?.valueChanges.subscribe((selectedDate: Date) => {
        this.onReportingDateSelected();
      });
    //  if(this.mode == 'view'){
    //   this.bookingForm.get('raisedBy.employee_name')?.disable();
    //   this.bookingForm.get('raisedBy.employee_contactNo')?.disable();
    //   this.bookingForm.get('raisedBy.employee_dept')?.disable();
    //  }

      // this.selectedDate = this.parseDateString(this.selectedDate);
      this.minDate = this.selectedDate;
      this.maxDate = this.addDaysToDate(this.minDate);
       
        console.log(this.mode);
        
        
    }
    getEmployeeDetails(){
      this.bookingService.getEmpAllDetails().subscribe((data:any)=>{
        this.employeeDetails = data;
      })
    }
    ngOnDestroy(): void {
      this.destroyed$.next();
      this.destroyed$.complete();
    }

    ngAfterViewInit(): void {

      this.initAutocomplete();
      this.initAutocompleteReporting();
    }
    loadDataAndInitializeForm() {
      forkJoin({
        departments: this.masterService.getAllDepartment(),
        carTypes: this.masterService.getAllCarType()
      }).subscribe({
        next: ({ departments, carTypes }) => {
          this.departmentList = departments;
          this.carType = carTypes;
          this.getBookingDetail();

        },
        error: (error) => {
          console.error('Error loading data:', error);
        }
      });
    }
    getBookingDetail(){
    
          if(this.bookingFormValue){
          
            this.bookingFormValue.bookingLocationMap.forEach(element => {
              if(this.bookingFormValue.bookingLocationMap.length>this.bookingLocationMap.length){
                this.addCarDetails();
              }
            });
            this.bookingFormValue.destination.forEach(ele=>{
              if(this.bookingFormValue.destination.length>this.destination.length){
                this.addDestination();
              }
            })
            this.bookingForm.patchValue(this.bookingFormValue);
            if(this.mode == 'view'){
              this.bookingForm.disable();
              const destinationArray = this.bookingForm.get('destination') as FormArray;
              destinationArray.controls.forEach((control) => {
                  control.disable();
                
              });
            }
            console.log(this.bookingForm.value);
            this.onSelectCar();
            
            if(this.bookingForm.controls['bookingType'].value =='ON_BEHALF'){
              this.bookingForm.get('raisedFor.onbehalfType')?.disable();
              this.bookingForm.get('raisedFor.onbehalfDepartmentCode')?.disable();
              this.isOnbehalf = true;
              if(this.bookingForm.get('raisedFor.onbehalfType')?.value == "INTERNAL_EMPLOYEE"){
                this.isEmployee = true;
                if(this.departmentList){
                  this.getCostCenterByDepartment(this.bookingForm.get('raisedFor.onbehalfDepartmentCode')?.value);
                }
              }
              else{
                this.getAllCostCenter();
                this.isEmployee = false;
              }
              
             }
             else{
              this.isOnbehalf = false;
              this.bookingForm.controls['bookingType'].patchValue('SELF');
              this.getCostCenterByDepartment(this.bookingForm.get('raisedBy.employeeDeptCode')?.value)
             }
             this.eventList = [];
            this.masterService.getEventByCostCode(this.bookingForm.controls['costCenterCode'].value).subscribe({
              next:(data:IEvent[])=>{
                this.eventList=data;
              }
            });
            if(this.bookingFormValue.bookingLocationMap.length>1){
              this.bookingForm.controls['reportingLocation'].patchValue('different')
            }
            this.bookingFormValue.bookingLocationMap.forEach(element => {
              if(this.bookingFormValue.bookingLocationMap.length>this.bookingLocationMap.length){
                this.bookingForm.controls['numCarsRequired'].patchValue(this.bookingForm.controls['numCarsRequired'].value + 1)
              }
            });
            this.bookingForm.get('bookingReportDto.carReportingDatetime')?.patchValue(this.parsedUTC(this.bookingForm.get('bookingReportDto.carReportingDatetime')?.value[0]));
            this.bookingForm.get('bookingReportDto.carRequiredTillDatetime')?.patchValue(this.parsedUTC(this.bookingForm.get('bookingReportDto.carRequiredTillDatetime')?.value));
            this.onChangeBookingPreference();
            if(this.bookingFormValue.bookingReportDto.bookingPreference != 'ONCE'){
              this.bookingForm.get('bookingReportDto.carRepeatTillDate')?.patchValue(((this.bookingForm.get('bookingReportDto.carRequiredTillDatetime')?.value)))
              this.onRepeateDateSelected();
            }
            else{
              this.bookingForm.get('bookingReportDto.carRequiredTillDatetime')?.patchValue(((this.bookingForm.get('bookingReportDto.carRequiredTillDatetime')?.value)))
            }
            
            
            this.bookingForm.get('bookingReportDto.carReportingDatetime')?.patchValue(((this.bookingForm.get('bookingReportDto.carReportingDatetime')?.value)))
            this.minDate = new Date((this.bookingForm.get('bookingReportDto.carReportingDatetime')?.value)[0]);
            this.maxDate = this.addDaysToDate(this.minDate);
            // this.searchTerm=this.bookingFormValue?.riderName;
            // if(this.bookingForm.get('bookingReportDto.carRepeatTillDate')?.value){
            //   this.onRepeateDateSelected();
            // }
          
          }
        

    }
    getAllDepartment(){
      this.masterService.getAllDepartment().subscribe({
        next:(data:IDepartment[])=>{
          this.departmentList = data;
        }
      })
    }
    getAllCostCenter(){
      this.masterService.getAllCostCenter().subscribe({
        next:(data)=>{
          this.costCenterList = data;
        }
      })
    }
    getCostCenterByDepartment(deptCode:any){
      this.masterService.getAllCostCenterByDepartmentCode(deptCode).subscribe({
        next:(data)=>{
          this.costCenterList = data;
        }
      })
    }
    getAllCarType(){
      this.masterService.getAllCarType().subscribe({
        next:(data:ICarType[])=>{
          this.carType = data;
        }
      })
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
    initAutocompleteReporting(): void {
      this.autocompleteReportingInput.forEach((inputRef, index) => {
        if (this.autocompleteReporting.has(index)) return; // Skip already initialized inputs
  
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
              const bookingLocationGroup = this.bookingLocationMap.at(index) as FormGroup;
              bookingLocationGroup.get('reportingAddress')?.setValue(place.formatted_address || '');
            } else {
              console.warn(`No details available for input: ${input.value}`);
            }
          });
        });
  
        // Store the Autocomplete instance
        this.autocompleteReporting.set(index, autocomplete);
      });
      }
    realignAutocompleteInstances(): void {
      const updatedInstances = new Map<number, google.maps.places.Autocomplete>();
      Array.from(this.autocompleteInstances.entries()).forEach(([oldIndex, instance], newIndex) => {
        updatedInstances.set(newIndex, instance);
      });
      this.autocompleteInstances = updatedInstances;
    }
    realignAutocompleteInstancesReporting(): void {
      const updatedInstances = new Map<number, google.maps.places.Autocomplete>();
      Array.from(this.autocompleteReporting.entries()).forEach(([oldIndex, instance], newIndex) => {
        updatedInstances.set(newIndex, instance);
      });
      this.autocompleteReporting = updatedInstances;
    }
    initiateForm() {
      this.bookingForm = this.fb.group({
        raisedBy: this.fb.group({
          employeeName:[`${this.employeeDetails?.firstName} ${this.employeeDetails?.lastName}`],
          employeeContactNo:[this.employeeDetails?.contactNo],
          employeeEmailId:[this.employeeDetails?.emailId],
          employeeDept:[this.employeeDetails?.departmentDescription],
          employeeDeptCode:[this.employeeDetails?.departmentCode],
          employeeId:[this.employeeDetails?.id]
        }),
        raisedFor: this.fb.group({
          onbehalfType:['INTERNAL_EMPLOYEE'],
          onbehalfContactNo:[null,[Validators.pattern('[1-9]{1}[0-9]{9}')]],
          onbehalfName:[null],
          onbehalfDepartment:[null],
          onbehalfDepartmentCode:[null],
          onbehalfEmployeeEmailId:[null],
          onbehalfEmployeeId:[null]
        }),
        carTypeId: ['',Validators.required],
        numPersonsTravelling: [1,Validators.required],
        numCarsRequired:[1,Validators.required],
        originatedFrom: ["PORTAL"],
        destination: this.fb.array([this.fb.control('', Validators.required)]),
        // bookingPreference: ['once'],
        locationType: ['LOCAL',Validators.required],
        reportingLocation: ['same',Validators.required],
        // carRequiredTillDatetime: [this.selectedDate],
        costCenterCode: ['',Validators.required],
        eventCode: [''],
        purpose: [null,Validators.required],
        bookingType:['ON_BEHALF',Validators.required],
        bookingLocationMap: this.fb.array([this.newCarDetails()]),
        bookingReportDto: this.fb.group({
          bookingPreference: ['ONCE'],
          excludeSunday: [true],
          excludeSaturday: [true],
          carReportingDatetime: [this.selectedDate],
          carRequiredTillDatetime: [this.selectedDate],
          carRepeatTillDate: [this.selectedDate],
          selectedDaysInaWeek: [],
        })
      });
    }
  
    get bookingLocationMap() {
      return this.bookingForm.get('bookingLocationMap') as FormArray;
    }
    addCarDetails() {
      this.bookingLocationMap.push(this.newCarDetails());
      setTimeout(()=>{
        this.initAutocompleteReporting();
      },0)
    }
    removeCarDetails(index: number) {
      this.bookingLocationMap.removeAt(index);
      if (this.autocompleteReporting.has(index)) {
        this.autocompleteReporting.delete(index);
      }
      this.realignAutocompleteInstances();
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
        contactName: ['',[Validators.required, Validators.pattern('^[a-zA-Z ]*$')]],
        contactNumber: ['',[Validators.required, Validators.pattern('[1-9]{1}[0-9]{9}')]],
        // carReleaseDatetime: [this.selectedDate],
        reportingAddress: ['',Validators.required],
        // releaseAddress: [''],
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
    parsedUTC(dateString:any){
      let now = new Date(dateString);
      now = new Date(now.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);
      console.log(now);
      
      return now;
    }
    onRepeateDateSelected() {
      console.log(this.bookingForm.get('bookingReportDto.carRepeatTillDate')?.value);
      
        if(this.bookingForm.get('bookingReportDto.bookingPreference')?.value == 'DAILY'){
          this.ifhasSaturday = this.hasSaturday(
            this.bookingForm.get('bookingReportDto.carReportingDatetime')?.value,
            this.bookingForm.get('bookingReportDto.carRepeatTillDate')?.value
          );
          this.ifhasSunday = this.hasSunday(
            this.bookingForm.get('bookingReportDto.carReportingDatetime')?.value,
            this.bookingForm.get('bookingReportDto.carRepeatTillDate')?.value
          );
        }
      
    }
  
    onReportingDateSelected() {
      console.log(this.bookingForm.get('bookingReportDto.carReportingDatetime')?.value);
      console.log(this.bookingForm.get('bookingReportDto.carRequiredTillDatetime')?.value);
      
      (this.minDate =  this.bookingForm.get('bookingReportDto.carReportingDatetime')?.value),
      this.bookingForm.get('bookingReportDto.carRepeatTillDate')?.value;
      this.minDate =  this.bookingForm.get('bookingReportDto.carReportingDatetime')?.value
    this.maxDate = this.addDaysToDate(this.minDate);
    // this.bookingForm.get('bookingReportDto.carRequiredTillDatetime')?.patchValue(this.minDate);
    // this.bookingForm.get('bookingReportDto.carRepeatTillDate')?.patchValue(this.minDate);

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
      console.log(this.carType);
      
      this.costOfCar = this.carType.filter(
        (value: any) => value.id == this.bookingForm.controls['carTypeId'].value
      )[0].ratePerHour;
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
      this.bookingForm.get('raisedFor.onbehalfName')?.patchValue(null);
      this.bookingForm.get('raisedFor.onbehalfDepartment')?.patchValue(null);
      this.bookingForm.get('raisedFor.onbehalfDepartmentCode')?.patchValue(null);
      this.bookingForm.get('raisedFor.onbehalfEmployeeEmailId')?.patchValue(null);
      this.bookingForm.get('raisedFor.onbehalfEmployeeId')?.patchValue(null);
      this.bookingForm.get('raisedFor.onbehalfContactNo')?.patchValue(null);
      console.log(this.bookingForm.get('raisedFor.onbehalfType')?.value );
      
      if(this.bookingForm.get('raisedFor.onbehalfType')?.value == "INTERNAL_EMPLOYEE"){
        this.isEmployee = true;
      }
      else{
        this.getAllCostCenter();
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
  selectItem(item: any) {
    this.searchTerm = item;
    this.showDropdown = false; // Hide the dropdown after selection
    let name = `${item.firstName} ${item.lastName}`;
    this.bookingForm.get('raisedFor.onbehalfName')?.patchValue(name);
    this.bookingForm.get('raisedFor.onbehalfEmployeeEmailId')?.patchValue(item.emailId);
    this.bookingForm.get('raisedFor.onbehalfEmployeeId')?.patchValue(item.id);
    this.bookingForm.get('raisedFor.onbehalfContactNo')?.patchValue(item.contactNo);
    this.filteredItems = []; 
  }
  hideDropdown() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 150); // Add a small delay to allow item click before hiding the dropdown
  }
  onSelectCoseCenter(){
    this.bookingForm.get('eventCode')?.patchValue(null);
    this.eventList = [];
    this.masterService.getEventByCostCode(this.bookingForm.controls['costCenterCode'].value).subscribe({
      next:(data:IEvent[])=>{
        this.eventList=data;
      }
    })
  }
  onSelectEvent(){
    console.log(this.bookingForm.controls['eventCode'].value);
    
    
  }
  searchEmployee(){
    console.log(this.bookingForm.get('raisedFor.onbehalfName')?.value);
    let params = {
      searchText:this.bookingForm.get('raisedFor.onbehalfName')?.value,
      departmentId:this.bookingForm.get('raisedFor.onbehalfDepartmentCode')?.value,
      query:"searchByName" 
    }
    this.bookingService.searchEmployeeByName(params).subscribe({
      next:(data)=>{
        this.filteredItems=data;
      }
    })
    
  }
  onSelectDepartment(){
    this.bookingForm.get('raisedFor.onbehalfName')?.patchValue(null);
    this.bookingForm.get('raisedFor.onbehalfEmployeeEmailId')?.patchValue(null);
    this.bookingForm.get('raisedFor.onbehalfEmployeeId')?.patchValue(null);
    this.bookingForm.get('raisedFor.onbehalfContactNo')?.patchValue(null);
    this.getCostCenterByDepartment(this.bookingForm.get('raisedFor.onbehalfDepartmentCode')?.value);
    this.bookingForm.get('raisedFor.onbehalfDepartment')?.patchValue(
      this.departmentList.filter((data:any)=>data.departmentCode == this.bookingForm.get('raisedFor.onbehalfDepartmentCode')?.value)[0].departmentDescription
    );
  }
  convertISOStringToFixedLocalDateTime(isoString:string) {
    console.log(isoString);
    
    // Input ISO date string
    // Split the ISO string into date and time components
    // let now = new Date(isoString);
    // now = new Date(now.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000)

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
    console.log(date);
    
    // Return the date as a string without altering the time
    return date; // Example: "Thu Jan 30 2025 08:00:00 GMT+0530 (India Standard Time)"
  }
  
}

