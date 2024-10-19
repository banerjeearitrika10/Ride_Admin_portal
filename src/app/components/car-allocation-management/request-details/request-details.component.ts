import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrl: './request-details.component.scss'
})
export class RequestDetailsComponent {
  details!:any;
  isOpen: boolean = false;
  constructor(private location: Location) {
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
}
