import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Page } from '../core/models/page';
import { IAllBookingResponse, IBookingResponse } from './models/booking';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingSearchDataFromFilterDialog$ = new Subject<any>();
  bookingSearchDataFromFilter$ = this.bookingSearchDataFromFilterDialog$.asObservable();

  constructor(private http: HttpClient) { }

  emitSearchDataForFilter(filterData: any) {
    this.bookingSearchDataFromFilterDialog$.next(filterData);
}
getEmpDetails(params:any):Observable<any>{
  return this.http.get<any>(
    `${environment.bookingService}/v1/employee`, {
    params: {
        ...params
    }
});
}
getAllBooking(pageRequest:any):Observable<Page<IAllBookingResponse>>{
  return this.http.get<Page<IAllBookingResponse>>(`${environment.bookingService}/v1/bookings`, {
    params: {
      ...pageRequest
    },
  })
}
getBookingDetailsId(bookingId : string): Observable<IBookingResponse> {
  return this.http.get<IBookingResponse>(
      `${environment.bookingService}/v1/bookings/${bookingId}`);
}
}
