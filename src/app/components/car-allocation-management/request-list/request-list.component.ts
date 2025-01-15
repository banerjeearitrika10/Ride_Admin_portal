import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CarAllotmentDialogComponent } from '../car-allotment-dialog/car-allotment-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RequestListComponent {
  @ViewChild('outerSort', { static: true }) sort!: MatSort;
  @ViewChildren('innerTables') innerTables!: QueryList<MatTable<any>>;
  @ViewChildren('innerSort') innerSort!: QueryList<MatSort>;
  showMessageIfTableIsBlank = false;
  isLoading = false;
  private destroyed$ = new Subject<void>();
  expandedElement: any | null;

  displayedColumns: string[] = [
    'date',
    'reportingAddress',
    'destination',
    'bookingPreference',
    'status',
    'allotCar',
    'details',

  ];
  innerDisplayedColumns: string[] = ['innerColumn1', 'action'];
  dataSource!: MatTableDataSource<any>;
  totalItems!: number;
  pageSize = 5;
  pageIndex = 0;
  searchKey = '';
  filterData = {};
  isOpen: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  requestData: any;
  usersData:any=[];
  bookingDetails:any=[];
 requestList :any=[]
  employeeDetails: any;
 constructor(public bookingService:BookingService,public router: Router, private dialog: MatDialog,){}
 
 ngOnInit(): void {
   let detail:any = localStorage.getItem('empDetails');
   this.getEmployeeDetails();
   if(this.employeeDetails){
   this.getBookingDetails({ size: this.pageSize, page: this.pageIndex ,clientType:"W",bookingStatus:'APPROVED'});
   }
   this.bookingService.allocationSearchDataFromFilter$
   .pipe(takeUntil(this.destroyed$))
   .subscribe((resp) => {
     if (Object.keys(resp).length) {
       this.searchKey = '';
       this.filterData = {fromDate: resp?.fromDate , toDate: resp?.toDate };
       this.dataSource = new MatTableDataSource();
       const obj = {
         size: this.pageSize,
         page: this.pageIndex,
         clientType:"W",
         bookingStatus:'APPROVED',
         ...this.filterData,
       };
       this.getBookingDetails(obj);
     } else {
       this.filterData = {};
       this.dataSource = new MatTableDataSource();
       this.pageSize = 5;
       this.pageIndex = 0;
       this.getBookingDetails({ size: this.pageSize, page: this.pageIndex ,clientType:"W",bookingStatus:'APPROVED'});
     }
   });
 }
 getEmployeeDetails(){
  this.bookingService.getEmpAllDetails().subscribe((data:any)=>{
    this.employeeDetails = data;
  })
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
       bookingStatus:'APPROVED',
       searchKey: this.searchKey,
     });
   } else if (Object.keys(this.filterData).length) {
     this.getBookingDetails({
       size: this.pageSize,
       page: this.pageIndex,
       clientType:"W",
       bookingStatus:'APPROVED',
       searchKey: this.searchKey,
       ...this.filterData,
     });
   } else {
     this.getBookingDetails({ size: this.pageSize, page: this.pageIndex,clientType:"W",bookingStatus:'APPROVED', });
   }
 }

 ngOnDestroy(): void {
   this.destroyed$.next();
   this.destroyed$.complete();
 }
 convertToReadableDate(isoString: string) {
  const options:any = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  };
  
  // Convert the UTC date to a Date object
  const utcDate = new Date(isoString);
  
  // Convert UTC to local date and time (IST: UTC+05:30)
  const localDate = new Date(utcDate.getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);
  
  // Format local date to the desired output
  const formattedLocalDate = localDate.toLocaleDateString('en-US', options);
  
  return formattedLocalDate;
}
viewDetails(parentId:any,childId:any){
  console.log(parentId);
  console.log(childId);
  
  
  // this.requestData=parentId;

  // let data = this.bookingDetails.filter(data=>data.bookingId==parentId)[0];
  this.router.navigate(['/car-allocation-management/details'],{ state: { parentId: parentId,childId:childId}});
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
hasInnerData(element: any): boolean {
  return element?.innerData?.data?.length > 0;
}
// updateDisplayedColumns(): void {
//   // Access the raw data using the `data` property
//   const hasInnerData = this.dataSource.data.some((element: any) => this.hasInnerData(element));
//   if (hasInnerData) {
//       this.displayedColumns = this.displayedColumns.filter(column => column !== 'actions');
//   } else if (!this.displayedColumns.includes('allotCar')) {
//       this.displayedColumns.push('allotCar');
//   }
// }

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
}
