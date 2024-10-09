import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingSetupComponent } from './booking-setup/booking-setup.component';

const routes: Routes = [
  {
    path:'',
    component:BookingSetupComponent
  },
  {
    path:'booking-setup',
    component:BookingSetupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingManagementRoutingModule { }
