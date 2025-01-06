export interface IBookingResponse {
  id: number;
  bookingCode: string;
  raisedby: RaisedByWrapper;
  bookingReportDto: BookingReportDto;
  numPersonsTravelling: number;
  locationType: string;
  destination: string[];
  numCarsRequired: number;
  costCenterCode: string;
  eventCode: string;
  purpose: string; 
  carTypeId: any;
  bookingStatus: string; 
  pickUpLocation: string[];
  bookingType: string; 
  raisedFor: RaisedForWrapper;
  bookingLocationMap: PickUpLocation[];
  carReportingDatetime:string;
}

export interface RaisedByWrapper {
  employee_dept: string;
  employee_name: string;
  employee_emailId: string;
  employee_contactNo: string;
}

export interface BookingReportDto {
  bookingPreference: string;
  carReportingDatetime: string[];
  excludeSunday: boolean;
  excludeSaturday: boolean;
  carRequiredTillDatetime: string;
  selectedDaysInaWeek: string[];
}

export interface RaisedForWrapper {
  behalfBookingType:string;
  onBehalf_dept: string | null;
  onBehalf_name: string | null;
  onBehalf_emailId: string| null;
  onBehalf_contactNo: string| null;
}

export interface IFilter {
  fromDate?: string;
  toDate?: string;
  status?: string;
}
export interface IAllBookingResponse{
  bookingId: number;
  bookingCode: string;
  carReportingDatetime: string;
  preference: string; 
  bookingType: string;
  bookingStatus: string;
  pickUpLocation: PickUpLocation[]; 
  destination: string[];
}
export interface PickUpLocation {
  id: number;
  reportingAddress: string;
  releaseAddress: string | null;
  carReleaseDatetime: string | null;
  contactName: string;
  contactNumber: string;
}