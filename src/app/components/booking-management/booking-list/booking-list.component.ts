import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { BookingService } from '../../services/booking.service';

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
      name: 'Aritrika',
      onBehalfOf:"Aritra",
      mobile: 6777666777,
      pickup: '57. Street, Grand Central Park',
      destination: '36. Street, Flamingo Mall',
      status: 'APPROVED',
      department: 'Marketing',
      carType: 'Dzire',
      carCost: '120',
      noOfPerson: 2,
      locationType: 'Local',
      purpose: 'Document Submission',
      date: '2024-10-21T11:10',
      reason: null,
    },
    {
      name: 'Aritrika',
      onBehalfOf:"Richa",
      mobile: 6777666777,
      pickup: '57. Street, Grand Central Park',
      destination: '36. Street, Flamingo Mall',
      status: 'REJECTED',
      department: 'Marketing',
      carType: 'Dzire',
      carCost: '120',
      noOfPerson: 2,
      locationType: 'Local',
      purpose: 'Document Submission',
      date: '2024-10-21T11:10',
      onbehalf: true,
      reason: null,
    },
    {
      name: 'Aritrika',
      onBehalfOf:"Pranab",
      mobile: 6777666777,
      pickup: '57. Street, Grand Central Park',
      destination: '36. Street, Flamingo Mall',
      status: 'PENDING',
      department: 'Marketing',
      carType: 'Dzire',
      carCost: '120',
      noOfPerson: 2,
      locationType: 'Local',
      purpose: 'Document Submission',
      date: '2024-10-21T11:10',
      reason: 'Insufficient data',
    },
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public bookingService:BookingService){}
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
 
}
