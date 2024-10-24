import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss'
})
export class RequestListComponent {
  showMessageIfTableIsBlank = false;
  isLoading = false;
  private destroyed$ = new Subject<void>();
  displayedColumns: string[] = [
    'name',
    'reportingDate',
    'destination',
    'noOfPerson',
    'allotCar',
  ];
  dataSource!: MatTableDataSource<any>;
  totalItems!: number;
  pageSize = 5;
  pageIndex = 0;
  searchKey = '';
  filterData = {};
  isOpen: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  requestData: any;
 requestList = [
  {
    carType: "Ertiga (5 + 1 persons) ",
    costCenter: "",
    costOfCar: 900,
    department: "Marketing",
    destination: "Asansol",
    eventCode: "",
    locationType: "LOCAL",
    noOfPerson: 2,
    noOfCar:2,
    purpose: "Document submission",
    bookingPreference:"daily",
    repeatDate: "2024-10-18T08:52:00.553Z",
    reportingDate: "2024-10-18T08:52:00.553Z",
    reportingLocation: "different",
    requiredDate: "2024-10-31T08:52:00",
    userName: "Aritrika",
    userNumber: 9878676788,
    empCode:"EMP002255",
    carDetails:[
      {
        addRelease: "Kolkata",
        addReporting: "Durgapur",
        contactName: "Sruti",
        contactNumber: 9898876565,
        releasedatetime: "2024-10-18T09:09:22.291Z"
      },
      {
        addRelease: "Kolkata",
        addReporting: "Asansol",
        contactName: "Sumana",
        contactNumber: 8888877777,
        releasedatetime: "2024-10-18T09:09:22.291Z"
      }
    ]
  },
  {
    carType: "Ertiga (5 + 1 persons) ",
    costCenter: "",
    costOfCar: 900,
    department: "Sales",
    destination: "Kolkata",
    eventCode: "",
    locationType: "LOCAL",
    noOfPerson: 1,
    noOfCar:1,
    purpose: "Document submission",
    bookingPreference:"once",
    repeatDate: "2024-10-18T08:52:00.553Z",
    reportingDate: "2024-10-18T08:52:00.553Z",
    reportingLocation: "different",
    requiredDate: "2024-10-31T08:52:00",
    userName: "Richa",
    userNumber: 9878676788,
    empCode:"EMP002678",
    carDetails:[
      {
        addRelease: "Kolkata",
        addReporting: "Durgapur",
        contactName: "Sruti",
        contactNumber: 9898876565,
        releasedatetime: "2024-10-18T09:09:22.291Z"
      }
    ]
  }
 ];
 constructor(public router:Router){}
 ngOnInit(): void {
  this.getBookingRequests({ size: this.pageSize, page: this.pageIndex });

}
 getBookingRequests(payload:any){
  this.showMessageIfTableIsBlank = false;
  this.isLoading = true;
  let data:any = {};
  data.content = this.requestList;
  console.log(data.content);
  
  this.showMessageIfTableIsBlank = data.content.length ? false : true;
  this.dataSource = new MatTableDataSource(data.content);
  this.totalItems = data.totalElements;
  this.isLoading = false;
}
onPageChange(event: any) {
  this.dataSource = new MatTableDataSource();
  this.pageIndex = event.pageIndex;
  this.pageSize = event.pageSize;
  if (this.searchKey.length) {
    this.getBookingRequests({
      size: this.pageSize,
      page: this.pageIndex,
      searchKey: this.searchKey,
    });
  } else if (Object.keys(this.filterData).length) {
    this.getBookingRequests({
      size: this.pageSize,
      page: this.pageIndex,
      searchKey: this.searchKey,
      ...this.filterData,
    });
  } else {
    this.getBookingRequests({ size: this.pageSize, page: this.pageIndex });
  }
}

ngOnDestroy(): void {
  this.destroyed$.next();
  this.destroyed$.complete();
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
viewDetails(element:any){
  this.requestData=element;
  this.router.navigate(['/car-allocation-management/details'],{ state: { data: this.requestData }});
}
allocateCar(element:any){
  this.requestData=element
 this.onOpenDrawer();
}
onOpenDrawer() {
  this.isOpen = true;
}

onCloseDrawer(ev: any) {
  this.isOpen = false;
}

}
