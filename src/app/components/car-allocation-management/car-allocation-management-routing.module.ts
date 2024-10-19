import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestLandingComponent } from './request-landing/request-landing.component';
import { RequestDetailsComponent } from './request-details/request-details.component';

const routes: Routes = [
  {
    path:'',
    component:RequestLandingComponent
  },
  {
    path:'details',
    component:RequestDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarAllocationManagementRoutingModule { }
