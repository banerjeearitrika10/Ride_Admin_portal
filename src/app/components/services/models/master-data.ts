export interface IDepartment {
    departmentCode: string;
    departmentDescription: string;
  }
  export interface IEvent {
    id: number;
    costCenterCode: string;
    eventCode: string;
    eventDescription: string;
    active: boolean;
  }
  export interface ICarType {
    id: number;
    carType: string;
    ratePerHour: number;
  }
  export interface ICostCenter {
    id: number;
    costCenterCode: string;
    costCenterApprovalMail: string;
    costCenterDescription: string;
  }
  
  