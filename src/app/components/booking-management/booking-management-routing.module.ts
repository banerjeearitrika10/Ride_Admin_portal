import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingSetupComponent } from './booking-setup/booking-setup.component';
import { BookingDetailsComponent } from './booking-details/booking-details.component';

const routes: Routes = [
  {
    path:'',
    component:BookingSetupComponent
  },
  {
    path:'booking-setup',
    component:BookingSetupComponent
  },
  {
    path:'details',
    component:BookingDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingManagementRoutingModule { }
