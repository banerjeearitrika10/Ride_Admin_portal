import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { CarAllotmentDialogComponent } from '../car-allotment-dialog/car-allotment-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from '../../services/master.service';
import { BookingService } from '../../services/booking.service';
import { ICarType, IEvent } from '../../services/models/master-data';
import { IBookingResponse } from '../../services/models/booking';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrl: './request-details.component.scss'
})
export class RequestDetailsComponent {
  private destroyed$ = new Subject<void>();
  details!:any;
  isOpen: boolean = false;
  detail!:any;
  costCenterList!: any;
  eventList!: IEvent[];
  employeeDetails: any;
  bookingDetails!:IBookingResponse;
  carType!: ICarType[] ;
  carDetails: any;
  constructor(private location: Location,private dialog: MatDialog,public bookingService:BookingService,public masterService:MasterService) {
     this.details=location.getState();
  }
  ngOnInit():void{
    let detail:any = localStorage.getItem('empDetails');
      this.employeeDetails = JSON.parse(detail); 
    this.costCenterList = this.employeeDetails?.costCenter;
    console.log( this.costCenterList);
    // console.log(this.det);

      this.getBookingById(this.details.parentId);
   

    this.getAllCarType();
    // this.details = this.details.data;
  }
  getBookingById(id:any){
    this.bookingService.getBookingDetailsId(id).subscribe({
      next: (result:IBookingResponse) => {
        this.bookingDetails = result;
        this.getEventList(this.bookingDetails.costCenterCode);
      },
      error: (err:any) => {
        console.log(err);
      },
    })
  }
  getAllCarType(){
    this.masterService.getAllCarType().subscribe({
      next:(data:ICarType[])=>{
        this.carType = data;
      }
    })
  }
  convertToReadableDate(isoString: string) {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short', // Short month name, like "Aug"
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true, // Use 12-hour format with AM/PM
    };
    return date.toLocaleDateString('en-US', options);
  }
  onOpenDrawer() {
    this.isOpen = true;
  }
  
  onCloseDrawer(ev: any) {
    this.isOpen = false;
  }
  onOpenAllotCar(detail:any){
    console.log(detail);
    if(this.bookingDetails.bookingReportDto.bookingPreference == 'ONCE')
   {
    this.bookingService.getCarDetails(this.details.parentId,detail.id).subscribe({
      next:(data)=>{
        this.carDetails = data;
        const dialogRef = this.dialog.open(CarAllotmentDialogComponent, {
          maxWidth: '30vw',
          width: '100%',
          panelClass: 'qa-confirm-dialog',
          data: this.carDetails ? this.carDetails : {}
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
          if (response) {
            // this.detail = response;
            console.log(response);
            
            let payload = {...response,...data};
            this.bookingService.assignCarDetails(payload).subscribe({
              next:(data:any)=>{
                console.log(data);
                
              }
            })
          } 
          
        });
        // this.patchReleaseDetails(data);
      }
    })
   }
    else{
      this.bookingService.getCarDetails(this.details.childId,detail.id).subscribe({
        next:(data)=>{
          this.carDetails = data;
          console.log(data);
          const dialogRef = this.dialog.open(CarAllotmentDialogComponent, {
            maxWidth: '30vw',
            width: '100%',
            panelClass: 'qa-confirm-dialog',
            data: this.carDetails ? this.carDetails : {}
          });
          dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
              // this.detail = response;
              console.log(response);
              
              let payload = {...response,...data};
              this.bookingService.assignCarDetails(payload).subscribe({
                next:(data:any)=>{
                  console.log(data);
                  
                }
              })
            } 
            
          });
          // this.patchReleaseDetails(data);
        }
      })
    }
    let data = {
      bookingLocationMapId:detail.id,
      parentBookingId:this.details.parentId,
      childBookingId:this.details.childId,
      bookingPreference:this.bookingDetails.bookingReportDto.bookingPreference,
      bookingReportingDate:this.bookingDetails.bookingReportDto.carReportingDatetime[0]};

   
  }
  getCarName(id:string){
    let car = this.carType.filter((details:any)=>details.id==id);
    return car[0].carType;
  }
  getCarCost(id:string){
    let car = this.carType.filter((details:any)=>details.id==id);
    return car[0].ratePerHour;
  }
  getCostCenterName(code:any){
    let ccName = this.costCenterList.filter((cc:any)=>cc.costCenterCode==code)[0].costCenterDescription;
    return ccName;
  }
  getEventList(id:any){
    this.masterService.getEventByCostCode(id).subscribe({
      next:(data:IEvent[])=>{
        this.eventList=data;
        console.log(this.eventList);
        
      }
    })
  }
  getEventName(code:any){
    let eventName = this.eventList.filter((cc:any)=>cc.eventCode==code)[0].eventDescription;
    return eventName;
  }
}
