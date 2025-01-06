import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private empSearch$ = new Subject<string>();
  empSearchKey$ = this.empSearch$.asObservable();
  private employeeSearchDataFromFilterDialog$ = new Subject<any>();
  employeeSearchDataFromFilter$ = this.employeeSearchDataFromFilterDialog$.asObservable();

  constructor(
    private http: HttpClient
) { }

  emitSearchKey(searchData: string) {
    this.empSearch$.next(searchData);
  }
  emitSearchDataForFilter(filterData: any) {
    this.employeeSearchDataFromFilterDialog$.next(filterData);
}

}
