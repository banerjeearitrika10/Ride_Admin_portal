import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestLandingComponent } from './request-landing/request-landing.component';
import { RequestDetailsComponent } from './request-details/request-details.component';
import { MatIconModule } from '@angular/material/icon';

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
  imports: [RouterModule.forChild(routes),MatIconModule],
  exports: [RouterModule]
})
export class CarAllocationManagementRoutingModule { }
