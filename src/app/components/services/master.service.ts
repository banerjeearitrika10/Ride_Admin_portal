import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICarType, ICostCenter, IDepartment, IEvent } from './models/master-data';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  constructor(private http: HttpClient) { }

  getAllDepartment():Observable<IDepartment[]>{
    return this.http.get<IDepartment[]>(
      `${environment.bookingService}/v1/master-data`,{
        params:{
          query:"departments"
        }
      })
  }
  getEventByCostCode(costCenterCode:string):Observable<IEvent[]>{
    return this.http.get<IEvent[]>(
      `${environment.bookingService}/v1/master-data`,{
        params:{
          costCenterCode:costCenterCode,
          query:"eventbycc"
        }
      })
  }
  getAllCarType():Observable<ICarType[]>{
    return this.http.get<ICarType[]>(
      `${environment.bookingService}/v1/master-data`,{
        params:{
          query:"cartypes"
        }
      })
  }
  getAllCostCenterByDepartmentCode(departmentCode:string):Observable<ICostCenter[]>{
    return this.http.get<ICostCenter[]>(
      `${environment.bookingService}/v1/master-data`,{
        params:{
          departmentCode:departmentCode,
          query:"ccbydptcode"
        }
      })
  }
}

