import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { CarAllotmentDialogComponent } from '../car-allotment-dialog/car-allotment-dialog.component';
import { MatDialog } from '@angular/material/dialog';

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
  constructor(private location: Location,private dialog: MatDialog) {
     this.details=location.getState();
  }
  ngOnInit():void{
    console.log(this.details.data);
    this.details = this.details.data;
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
    const dialogRef = this.dialog.open(CarAllotmentDialogComponent, {
      maxWidth: '30vw',
      width: '100%',
      panelClass: 'qa-confirm-dialog',
      data: detail ? detail : {}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
      if (response) {
        this.detail = response;
      } 
      
    });
  }
}
