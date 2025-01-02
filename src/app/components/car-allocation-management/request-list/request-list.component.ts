import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CarAllotmentDialogComponent } from '../car-allotment-dialog/car-allotment-dialog.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
    'name',
    'reportingDate',
    'destination',
    'bookingPreference',
    'noOfPerson',
    'details',
    'allotCar',
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
 requestList = [
  {
    bookingId:1,
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
    innerData: [
      { date: 'Inner Row A' },
      { date: 'Inner Row B' }
    ],
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
    bookingId:2,
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
 constructor(public router:Router,private dialog: MatDialog){}
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
  // this.dataSource = new MatTableDataSource(data.content);
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
  console.log(element);
  
  this.requestData=element;
  let data = this.requestList.filter(data=>data.bookingId==element.bookingId)[0];
  this.router.navigate(['/car-allocation-management/details'],{ state: { data: data}});
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
  if(element.innerData && (element.innerData as MatTableDataSource<any>).data.length ){
    element.expanded = !element.expanded;
  }
  element.innerData && (element.innerData as MatTableDataSource<any>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
  this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<any>).sort = this.innerSort.toArray()[index]);
}
}
