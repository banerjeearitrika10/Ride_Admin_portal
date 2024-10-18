import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeLandingComponent } from './employee-landing/employee-landing.component';

const routes: Routes = [
  {
    path:'',
    component:EmployeeLandingComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeManagementRoutingModule { }
