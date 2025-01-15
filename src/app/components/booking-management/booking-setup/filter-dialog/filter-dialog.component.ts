
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BookingService } from 'src/app/components/services/booking.service';
import { IFilter } from 'src/app/components/services/models/booking';


@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit, OnDestroy  {
  filterForm!: FormGroup;
  private destroyed$ = new Subject<void>();
  status=[
    {
      code:"PENDING",
      name:"Pending"
    },
    {
      code:"APPROVED",
      name:"Approved"
    },
    {
      code:"REJECTED",
      name:"Rejected"
    },
    { name: 'Inprogress', code: 'INPROGRESS' },
    { name: 'Cancel', code: 'CANCELLED' },
  ];

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFilter,public bookingService:BookingService
  ) { }

  ngOnInit() {

    this.filterForm = new FormGroup({
      fromDate: new FormControl(new Date()),
      toDate: new FormControl(new Date()),
      status: new FormControl(''),
    });

    if (this.data) {
      this.filterForm.patchValue({
        ...this.data
      });
    }

  }

  applyFilter() {
    this.filterForm.controls['fromDate'].patchValue(this.convertDateToExactISOString(this.filterForm.controls['fromDate'].value));
    this.filterForm.controls['toDate'].patchValue(this.convertDateToExactISOString(this.filterForm.controls['toDate'].value));
    this.filterForm.controls['fromDate'].patchValue(this.filterForm.controls['fromDate'].value.split('T')[0]);
    this.filterForm.controls['toDate'].patchValue(this.filterForm.controls['toDate'].value.split('T')[0]);
    this.dialogRef.close(this.filterForm.value);
    this.filterForm.reset();
  }
  convertDateToExactISOString(date:string): string {
    // Input date string
     const inputDate = new Date(date);
    
    // Get the components of the date
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(inputDate.getDate()).padStart(2, '0');
    const hours = String(inputDate.getHours()).padStart(2, '0');
    const minutes = String(inputDate.getMinutes()).padStart(2, '0');
    const seconds = String(inputDate.getSeconds()).padStart(2, '0');
    
    // Construct the ISO string without converting to UTC
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  refreshTable() {
    this.filterForm.reset()
    this.bookingService.emitSearchDataForFilter({})
    this.dialogRef.close(false)
  }
}
