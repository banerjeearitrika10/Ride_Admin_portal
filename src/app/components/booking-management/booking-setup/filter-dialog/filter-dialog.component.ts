
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
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IFilter,public bookingService:BookingService
  ) { }

  ngOnInit() {

    this.filterForm = new FormGroup({
      fromDate: new FormControl(''),
      toDate: new FormControl(''),
      status: new FormControl(''),
    });

    if (this.data) {
      this.filterForm.patchValue({
        ...this.data
      });
    }

  }

  applyFilter() {
    this.dialogRef.close(this.filterForm.value);
    this.filterForm.reset();
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
