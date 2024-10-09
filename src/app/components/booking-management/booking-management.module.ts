import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookingManagementRoutingModule } from './booking-management-routing.module';
import { BookingSetupComponent } from './booking-setup/booking-setup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { ComponentsModule } from '../shared/components/components.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [BookingSetupComponent],
  imports: [
    CommonModule,
    BookingManagementRoutingModule,
    NgScrollbarModule,
    MatIconModule,
    NgApexchartsModule,
    MatButtonModule,
    MatMenuModule,
    ComponentsModule,
    SharedModule,
  ]
})
export class BookingManagementModule { }
