export interface IBookingResponse {
  id: number;
  bookingCode: string;
  raisedBy: RaisedByWrapper;
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
  employeeDept: string;
  employeeName: string;
  employeeEmailId: string;
  employeeContactNo: string;
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
  onbehalfDepartment: string | null;
  onbehalfName: string | null;
  onbehalfEmployeeEmailId: string| null;
  onbehalfContactNo: string| null;
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