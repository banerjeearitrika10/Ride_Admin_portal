import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from './components/layout/app-layout/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/admin/dashboard/main', pathMatch: 'full' },
      {
        path: 'admin',
        loadChildren: () =>
          import('./components/admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'booking-management',
        loadChildren: () =>
          import('./components/booking-management/booking-management.module').then((m) => m.BookingManagementModule),
      },
      {
        path: 'employee-management',
        loadChildren: () =>
          import('./components/employee-management/employee-management.module').then((m) => m.EmployeeManagementModule),
      },
      {
        path: 'car-allocation-management',
        loadChildren: () =>
          import('./components/car-allocation-management/car-allocation-management.module').then((m) => m.CarAllocationManagementModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
