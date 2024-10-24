import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.scss'
})
export class EmployeeDetailsComponent {
  empDetails!:any;
  constructor(private location: Location) {
     this.empDetails=location.getState();
  }
  ngOnInit():void{
    this.empDetails = this.empDetails.data;
  }
}
