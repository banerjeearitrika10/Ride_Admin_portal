import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { BookingService } from '../../services/booking.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CarDetailDialogComponent } from '../booking-setup/car-detail-dialog/car-detail-dialog.component';

@Component({
  selector: 'app-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrl: './booking-list.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BookingListComponent {
  @ViewChild('outerSort', { static: true }) sort!: MatSort;
  @ViewChildren('innerTables') innerTables!: QueryList<MatTable<any>>;
  @ViewChildren('innerSort') innerSort!: QueryList<MatSort>;
  showMessageIfTableIsBlank = false;
  isLoading = false;
  private destroyed$ = new Subject<void>();
  usersData:any=[];
  displayedColumns: string[] = [
    'onBehalfOf',
    'date',
    'destination',
    'bookingPreference',
    'status',
    'action',
    'details'
  ];
  innerDisplayedColumns: string[] = ['innerColumn1', 'action'];
  dataSource!: MatTableDataSource<any>;
  totalItems!: number;
  pageSize = 5;
  pageIndex = 0;
  searchKey = '';
  filterData = {};
  expandedElement: any | null;
  bookingDetails: any = [
    {
      bookingId:1,
      onBehalf:true,
      riderName:"Pranab",
      riderNumber:"8987676544",
      status:"Approved",
      carType: "Ertiga (5 + 1 persons) ",
      costCenter: "",
      costOfCar: 900,
      department: "MARKETING",
      destination: ["Asansol"],
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
      innerData: [
        { date: 'Inner Row A' },
        { date: 'Inner Row B' }
      ],
      bookingLocationMap:[
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
      bookingId:2,
      onBehalf:true,
      riderName:"Shalini",
      riderNumber:"8987676544",
      status:"Rejected",
      carType: "Ertiga (5 + 1 persons) ",
      costCenter: "",
      costOfCar: 900,
      department: "Sales",
      destination: ["Kolkata"],
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
      bookingLocationMap:[
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
  dataFromDialog!: any;

  constructor(public bookingService:BookingService,public router: Router, private dialog: MatDialog,){}
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
  getBookingDetails(payLoad:any){
    this.showMessageIfTableIsBlank = false;
    this.isLoading = true;
    let data:any = {};
    data.content = this.bookingDetails;
    console.log("Hiii");
    
    this.bookingService.getAllBooking({ ...payLoad }).subscribe({
      next: (data) => {
        console.log("HIII");
        
        this.showMessageIfTableIsBlank = data.content.length ? false : true;
        this.dataSource = new MatTableDataSource(data.content);
        this.totalItems = data.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.showMessageIfTableIsBlank = true;
      },
    });
    
    this.showMessageIfTableIsBlank = data.content.length ? false : true;
    data.content.forEach(user => {
      if (user.innerData && Array.isArray(user.innerData) && user.innerData.length) {
        this.usersData = [...this.usersData, {...user,innerData: new MatTableDataSource(user.innerData),expanded:false}];
        console.log(this.usersData);
        
      } else {
        this.usersData = [...this.usersData, user];
      }
    });
    console.log(this.usersData);
    
    this.dataSource = new MatTableDataSource(this.usersData);
    this.dataSource.sort = this.sort;
    // this.dataSource = new MatTableDataSource(data.content);
    // this.dataSource.sort = this.sort;
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
    console.log(mode);
    let data = this.bookingDetails.filter(data=>data.bookingId==element.bookingId)[0];
    this.router.navigate(['/booking-management/details'],{ state: { data: data,mode: mode }});
  }
  cancleBooking(index: number) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        maxWidth: '30vw',
        width: '100%',
        panelClass: 'qa-confirm-dialog'
    });

    dialogRef.afterClosed()
        .pipe(takeUntil(this.destroyed$))
        .subscribe(result => {
            console.log(result);
            if (result) {
               
            }
        });
}
// isMainRow = (index: number, row: any) => !row.expanded;
// isExpandedRow = (index: number, row: any) => row.expanded;
toggleRow(element: any) {
  if(element.innerData && (element.innerData as MatTableDataSource<any>).data.length ){
    element.expanded = !element.expanded;
  }
  element.innerData && (element.innerData as MatTableDataSource<any>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
  this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<any>).sort = this.innerSort.toArray()[index]);
}
onClickCarDetails(element:any){
  const dialogRef = this.dialog.open(CarDetailDialogComponent, {
    maxWidth: '30vw',
    width: '100%',
    panelClass: 'qa-confirm-dialog',
    data: element ? element : {}
  });
  dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
    if (response) {
      this.dataFromDialog = response;
    } 
    
  });
}
}
