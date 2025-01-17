import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from './material-module';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { FeatherIconsModule } from './components/feather-icons/feather-icons.module';
import { TruncatePipe } from './truncate.pipe';

@NgModule({
  declarations: [TruncatePipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FeatherIconsModule,
    NgxMatTimepickerModule.setLocale('en-GB')
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule,
    FeatherIconsModule,
    NgxMatTimepickerModule,
    TruncatePipe
  ],
})
export class SharedModule { }
