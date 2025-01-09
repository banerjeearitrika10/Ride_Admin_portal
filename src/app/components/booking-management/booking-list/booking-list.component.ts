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
    'date',
    'reportingAddress',
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
  bookingDetails:any=[];
  // bookingDetails: any = [
  //   {
  //     bookingId:1,
  //     onBehalf:true,
  //     riderName:"Pranab",
  //     riderNumber:"8987676544",
  //     status:"Approved",
  //     carType: "Ertiga (5 + 1 persons) ",
  //     costCenter: "",
  //     costOfCar: 900,
  //     department: "MARKETING",
  //     destination: ["Asansol","Kolkata"],
  //     eventCode: "",
  //     locationType: "LOCAL",
  //     noOfPerson: 2,
  //     noOfCar:2,
  //     purpose: "Document submission",
  //     bookingPreference:"daily",
  //     repeatDate: "2024-10-28T08:52:00.553Z",
  //     reportingDate: "2024-10-18T08:52:00.553Z",
  //     reportingLocation: "different",
  //     requiredDate: "2024-10-31T08:52:00",
  //     userName: "Aritrika",
  //     userNumber: 9878676788,
  //     empCode:"EMP002255",
  //     innerData: [
  //       { date: 'Inner Row A' },
  //       { date: 'Inner Row B' }
  //     ],
  //     bookingLocationMap:[
  //       {
  //         addRelease: "Kolkata",
  //         addReporting: "Durgapur",
  //         contactName: "Sruti",
  //         contactNumber: 9898876565,
  //         releasedatetime: "2024-10-18T09:09:22.291Z"
  //       },
  //       {
  //         addRelease: "Kolkata",
  //         addReporting: "Asansol",
  //         contactName: "Sumana",
  //         contactNumber: 8888877777,
  //         releasedatetime: "2024-10-18T09:09:22.291Z"
  //       }
  //     ]
  //   },
  //   {
  //     bookingId:2,
  //     onBehalf:true,
  //     riderName:"Shalini",
  //     riderNumber:"8987676544",
  //     status:"Rejected",
  //     carType: "Ertiga (5 + 1 persons) ",
  //     costCenter: "",
  //     costOfCar: 900,
  //     department: "Sales",
  //     destination: ["Kolkata"],
  //     eventCode: "",
  //     locationType: "LOCAL",
  //     noOfPerson: 1,
  //     noOfCar:1,
  //     purpose: "Document submission",
  //     bookingPreference:"once",
  //     repeatDate: "2024-10-28T08:52:00.553Z",
  //     reportingDate: "2024-10-18T08:52:00.553Z",
  //     reportingLocation: "different",
  //     requiredDate: "2024-10-31T08:52:00",
  //     userName: "Richa",
  //     userNumber: 9878676788,
  //     empCode:"EMP002678",
  //     bookingLocationMap:[
  //       {
  //         addRelease: "Kolkata",
  //         addReporting: "Durgapur",
  //         contactName: "Sruti",
  //         contactNumber: 9898876565,
  //         releasedatetime: "2024-10-18T09:09:22.291Z"
  //       }
  //     ]
  //   }
  // ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataFromDialog!: any;
  employeeDetails!: any;
  chaildDetails: any=[];

  constructor(public bookingService:BookingService,public router: Router, private dialog: MatDialog,){}
  ngOnInit(): void {
    let detail:any = localStorage.getItem('empDetails');
    this.employeeDetails = JSON.parse(detail); 
    this.getBookingDetails({ size: this.pageSize, page: this.pageIndex ,clientType:"W"});
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
          clientType:"W",
          ...this.filterData,
        };
        this.getBookingDetails(obj);
      } else {
        this.filterData = {};
        this.dataSource = new MatTableDataSource();
        this.pageSize = 5;
        this.pageIndex = 0;
        this.getBookingDetails({ size: this.pageSize, page: this.pageIndex ,clientType:"W"});
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
      next: (data:any) => {
        console.log("HIII");
        console.log(data);
        
        this.showMessageIfTableIsBlank = data.content.length ? false : true;
        this.bookingDetails = data.content.map(user => ({
          ...user,
          expanded: false, // Add an expanded property to manage toggle state
          innerData: null, // Initialize as null to fetch data later
        }));
        this.dataSource = new MatTableDataSource(this.bookingDetails);
        this.bookingDetails = data.content;
        this.totalItems = data.page.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.showMessageIfTableIsBlank = true;
      },
    });
    
    this.showMessageIfTableIsBlank = data.content.length ? false : true;
    // data.content.forEach(user => {
    //   if (user.innerData && Array.isArray(user.innerData) && user.innerData.length) {
    //     this.usersData = [...this.usersData, {...user,innerData: new MatTableDataSource(user.innerData),expanded:false}];
    //     console.log(this.usersData);
        
    //   } else {
    //     this.usersData = [...this.usersData, user];
    //   }
    // });
    // console.log(this.usersData);
    
    // this.dataSource = new MatTableDataSource(this.usersData);
    // this.dataSource.sort = this.sort;
    // this.dataSource = new MatTableDataSource(data.content);
    // this.dataSource.sort = this.sort;
    // this.totalItems = data.totalElements;
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
        clientType:"W",
        searchKey: this.searchKey,
      });
    } else if (Object.keys(this.filterData).length) {
      this.getBookingDetails({
        size: this.pageSize,
        page: this.pageIndex,
        clientType:"W",
        searchKey: this.searchKey,
        ...this.filterData,
      });
    } else {
      this.getBookingDetails({ size: this.pageSize, page: this.pageIndex,clientType:"W" });
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
    console.log(element);
    let data = this.bookingDetails.filter(data=>data.bookingId==element.bookingId)[0];
    this.router.navigate(['/booking-management/details'],{ state: { data: data,mode: mode }});
  }
  cancleBooking(id: number) {
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
              this.bookingService.cancleBooking({parentBookingId:id}).subscribe({
                next:(res:any)=>{
                  this.getBookingDetails({ size: this.pageSize, page: this.pageIndex,clientType:"W" });

                },
                error:(err:any)=>{
                }
              })
            }
        });
}
cancleChildBooking(element:any){
  let cancleBookingDetails = element;
  console.log();
  
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
          this.bookingService.cancleBooking({parentBookingId:cancleBookingDetails.parentBookingId,childDailyBookingId:cancleBookingDetails.id}).subscribe({
            next:(res:any)=>{
              this.getBookingDetails({ size: this.pageSize, page: this.pageIndex,clientType:"W" });

            },
            error:(err:any)=>{
            }
          })
        }
    });
}
// isMainRow = (index: number, row: any) => !row.expanded;
// isExpandedRow = (index: number, row: any) => row.expanded;
toggleRow(element: any) {
  // console.log(element.expanded);
  
  if (!element.expanded && element.preference != 'ONCE') {
    // Fetch data only if the row is not expanded
    this.bookingService.getChildBooking(element.bookingId, element.preference).subscribe({
      next: (childData) => {
        element.innerData = new MatTableDataSource(childData); // Assign fetched data
        element.expanded = true; // Expand the row
        this.expandedElement = element; // Track the expanded element
        console.log(element);
        
        // element.innerData && (element.innerData as MatTableDataSource<any>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
        // this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<any>).sort = this.innerSort.toArray()[index]);
      },
      error: () => {
        console.error("Error fetching child data");
      },
    });
  } else {
    // Collapse the row
    element.expanded = false;
    this.expandedElement = null;
  }

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
