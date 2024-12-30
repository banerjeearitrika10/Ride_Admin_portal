import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { EmployeeService } from '../../services/employee.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {
  showMessageIfTableIsBlank = false;
  isLoading = false;
  private destroyed$ = new Subject<void>();
  displayedColumns: string[] = [
    'name',
    'address',
    'mobile',
    'department',
    'action'
  ];
  dataSource!: MatTableDataSource<any>;
  totalItems!: number;
  pageSize = 5;
  pageIndex = 0;
  searchKey = '';
  filterData = {};
  bookingDetails: any = [
    {
      firstName: 'Aritrika',
      lastName:"Banerjee",
      mobile: 9876545678,
      emailId:"abc@gmail.com",
      address: '57. Street, Grand Central Park',
      department: 'Sales',
      empId:"EMP1000",
      managerEmail:"manager1@company.com"
    },
    {
      firstName: 'Indrani',
      lastName:"Roy",
      mobile: 6777666777,
      emailId:"abc@gmail.com",
      address: '57. Street, Asansol Central Park',
      department: 'Marketing',
      empId:"EMP1001",
      managerEmail:"manager2@company.com"
    }
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public empservice:EmployeeService,public router:Router){}
  ngOnInit(): void {
    this.getEmpDetails({ size: this.pageSize, page: this.pageIndex });
    this.empservice.empSearchKey$
    .pipe(takeUntil(this.destroyed$))
    .subscribe((searchKey) => {
      if (searchKey && searchKey.length >= 3) {
        this.searchKey = searchKey;
        this.filterData = {};
        this.dataSource = new MatTableDataSource();
        this.dataSource.paginator = this.paginator;
        const obj = {
          size: this.pageSize,
          page: this.pageIndex,
          searchKey: searchKey,
        };
        this.getEmpDetails(obj);
      } else if (!searchKey) {
        this.searchKey = '';
        this.dataSource = new MatTableDataSource();
        this.pageSize = 5;
        this.pageIndex = 0;
        this.getEmpDetails({ size: this.pageSize, page: this.pageIndex });
      }
    });
    this.empservice.employeeSearchDataFromFilter$
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
        this.getEmpDetails(obj);
      } else {
        this.filterData = {};
        this.dataSource = new MatTableDataSource();
        this.pageSize = 5;
        this.pageIndex = 0;
        this.getEmpDetails({ size: this.pageSize, page: this.pageIndex });
      }
    });
  }
  getEmpDetails(payload:any){
    this.showMessageIfTableIsBlank = false;
    this.isLoading = true;
    let data:any = {};
    data.content = this.bookingDetails;
    console.log(data.content);
    
    this.showMessageIfTableIsBlank = data.content.length ? false : true;
    this.dataSource = new MatTableDataSource(data.content);
    this.dataSource.paginator = this.paginator;
    this.totalItems = data.totalElements;
    this.isLoading = false;
  }
  onPageChange(event: any) {
    this.dataSource = new MatTableDataSource();
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.searchKey.length) {
      this.getEmpDetails({
        size: this.pageSize,
        page: this.pageIndex,
        searchKey: this.searchKey,
      });
    } else if (Object.keys(this.filterData).length) {
      this.getEmpDetails({
        size: this.pageSize,
        page: this.pageIndex,
        searchKey: this.searchKey,
        ...this.filterData,
      });
    } else {
      this.getEmpDetails({ size: this.pageSize, page: this.pageIndex });
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
    this.router.navigate(['/employee-management/details'],{ state: { data: element }});
  }
}
