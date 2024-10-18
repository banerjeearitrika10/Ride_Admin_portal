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
empBulUpload(formData: any){
  // return this.http.post<any>(`${environment.studentService}/v1/b2bStudent-bulk-upload`,formData)
}
getTemplateRequests(id: string) {
  // return this.http.get<any>(`${environment.studentService}/v1/b2bStudent-bulk-upload/${id}`);
}
downloadSample(){
  // return this.http.get<Blob>(`${environment.studentService}/v1/b2bStudent-bulk-upload/studentTemplate`, { observe: 'response', responseType: 'blob' as 'json' });
}
}
