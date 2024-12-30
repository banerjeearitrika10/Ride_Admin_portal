import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-car-detail-dialog',
  templateUrl: './car-detail-dialog.component.html',
  styleUrl: './car-detail-dialog.component.scss'
})
export class CarDetailDialogComponent implements OnInit{
  releaseForm!: FormGroup;
  private destroyed$ = new Subject<void>();
  public today = new Date();
  selectedDate: any = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 0, 0, 0);
  constructor(private fb:FormBuilder,
    public dialogRef: MatDialogRef<CarDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  ngOnInit() {
    this.initiateForm();
   
    
  }
  initiateForm(){
    this.releaseForm = this.fb.group({
      carReleaseDatetime: [this.selectedDate],
      releaseAddress: [''],
    })
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  onCancle(){
    this.releaseForm.reset();
    this.dialogRef.close(false);
  }
  onApply(){
    this.dialogRef.close(this.releaseForm.value);
  }
}
