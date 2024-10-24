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
import { BookingListComponent } from './booking-list/booking-list.component';
import { BookCabComponent } from './book-cab/book-cab.component';
import { OnBehalfBookingFormComponent } from './on-behalf-booking-form/on-behalf-booking-form.component';
import { MaterialModule } from '../shared/material-module';
import { FilterDialogComponent } from './booking-setup/filter-dialog/filter-dialog.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';


@NgModule({
  declarations: [BookingSetupComponent,BookingListComponent,OnBehalfBookingFormComponent,BookCabComponent,FilterDialogComponent, BookingDetailsComponent],
  imports: [
    CommonModule,
    BookingManagementRoutingModule,
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
export class BookingManagementModule { }
