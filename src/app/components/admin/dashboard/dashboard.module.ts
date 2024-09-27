import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MainComponent } from './main/main.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';

import { NgApexchartsModule } from 'ng-apexcharts';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ComponentsModule } from './../../shared/components/components.module';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [MainComponent, Dashboard2Component],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgScrollbarModule,
    MatIconModule,
    NgApexchartsModule,
    MatButtonModule,
    MatMenuModule,
    ComponentsModule,
    SharedModule,
  ],
})
export class DashboardModule {}
