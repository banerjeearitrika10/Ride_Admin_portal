export interface IBookingResponse{
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