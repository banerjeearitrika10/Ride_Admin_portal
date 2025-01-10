import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarAllocationManagementRoutingModule } from './car-allocation-management-routing.module';
import { RequestLandingComponent } from './request-landing/request-landing.component';
import { RequestListComponent } from './request-list/request-list.component';
import { CarAllocationComponent } from './car-allocation/car-allocation.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ComponentsModule } from '../shared/components/components.module';
import { MaterialModule } from '../shared/material-module';
import { SharedModule } from '../shared/shared.module';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { CarAllotmentDialogComponent } from './car-allotment-dialog/car-allotment-dialog.component';
import { AllocationFilterDialogComponent } from './request-landing/filter-dialog/filter-dialog.component';


@NgModule({
  declarations: [
    RequestLandingComponent,
    RequestListComponent,
    CarAllocationComponent,
    RequestDetailsComponent,
    CarAllotmentDialogComponent,
    AllocationFilterDialogComponent
  ],
  imports: [
    CommonModule,
    CarAllocationManagementRoutingModule,
    NgScrollbarModule,
    MatIconModule,
    MaterialModule,
    NgApexchartsModule,
    MatButtonModule,
    MatMenuModule,
    ComponentsModule,
    SharedModule,
    
  ]
})
export class CarAllocationManagementModule { }
