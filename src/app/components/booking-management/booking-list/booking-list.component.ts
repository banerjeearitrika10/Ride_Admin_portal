import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss'
})
export class BookingListComponent {
  showMessageIfTableIsBlank = false;
  isLoading = false;
  private destroyed$ = new Subject<void>();
  displayedColumns: string[] = [
    'onBehalfOf',
    'date',
    'destination',
    'status',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;
  totalItems!: number;
  pageSize = 5;
  pageIndex = 0;
  searchKey = '';
  filterData = {};
  bookingDetails: any = [
    {
      onBehalf:true,
      riderName:"Pranab",
      riderNumber:"8987676544",
      status:"Approved",
      carType: "Ertiga (5 + 1 persons) ",
      costCenter: "",
      costOfCar: 900,
      department: "MARKETING",
      destination: "Asansol",
      eventCode: "",
      locationType: "LOCAL",
      noOfPerson: 2,
      noOfCar:2,
      purpose: "Document submission",
      bookingPreference:"daily",
      repeatDate: "2024-10-28T08:52:00.553Z",
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
      onBehalf:true,
      riderName:"Shalini",
      riderNumber:"8987676544",
      status:"Rejected",
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
      repeatDate: "2024-10-28T08:52:00.553Z",
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
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public bookingService:BookingService,public router: Router){}
  ngOnInit(): void {
    this.getBookingDetails({ size: this.pageSize, page: this.pageIndex });
    this.bookingService.bookingSearchDataFromFilter$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((resp) => {
      if (Object.keys(resp).length) {
        this.searchKey = '';
        this.filterData = { status: resp?.status, fromDate: resp?.fromDate , toDate: resp?.toDate };
        this.dataSource = new MatTableDataSource();
        const obj = {
          size: this.pageSize,
          page: this.pageIndex,
          ...this.filterData,
        };
        this.getBookingDetails(obj);
      } else {
        this.filterData = {};
        this.dataSource = new MatTableDataSource();
        this.pageSize = 5;
        this.pageIndex = 0;
        this.getBookingDetails({ size: this.pageSize, page: this.pageIndex });
      }
    });
  }
  getBookingDetails(payload:any){
    this.showMessageIfTableIsBlank = false;
    this.isLoading = true;
    let data:any = {};
    data.content = this.bookingDetails;
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
      this.getBookingDetails({
        size: this.pageSize,
        page: this.pageIndex,
        searchKey: this.searchKey,
      });
    } else if (Object.keys(this.filterData).length) {
      this.getBookingDetails({
        size: this.pageSize,
        page: this.pageIndex,
        searchKey: this.searchKey,
        ...this.filterData,
      });
    } else {
      this.getBookingDetails({ size: this.pageSize, page: this.pageIndex });
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
  editAndView(element:any,mode:string){
    this.router.navigate(['/booking-management/details'],{ state: { data: element,mode: mode }});
  }
}
