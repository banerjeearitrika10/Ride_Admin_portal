import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookingSearchDataFromFilterDialog$ = new Subject<any>();
  bookingSearchDataFromFilter$ = this.bookingSearchDataFromFilterDialog$.asObservable();

  constructor() { }

  emitSearchDataForFilter(filterData: any) {
    this.bookingSearchDataFromFilterDialog$.next(filterData);
}
}
