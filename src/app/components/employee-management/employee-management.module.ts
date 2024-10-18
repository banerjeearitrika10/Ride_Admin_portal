import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeManagementRoutingModule } from './employee-management-routing.module';
import { EmployeeLandingComponent } from './employee-landing/employee-landing.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ComponentsModule } from '../shared/components/components.module';
import { MaterialModule } from '../shared/material-module';
import { SharedModule } from '../shared/shared.module';
import { UploadEmployeeComponent } from './upload-employee/upload-employee.component';


@NgModule({
  declarations: [
    EmployeeLandingComponent,
    EmployeeListComponent,
    EmployeeDetailsComponent,
    UploadEmployeeComponent
  ],
  imports: [
    CommonModule,
    EmployeeManagementRoutingModule,
    NgScrollbarModule,
    MatIconModule,
    MaterialModule,
    NgApexchartsModule,
    MatButtonModule,
    MatMenuModule,
    ComponentsModule,
    SharedModule
  ]
})
export class EmployeeManagementModule { }
