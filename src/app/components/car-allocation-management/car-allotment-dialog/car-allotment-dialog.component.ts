import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-car-allotment-dialog',
  templateUrl: './car-allotment-dialog.component.html',
  styleUrl: './car-allotment-dialog.component.scss'
})
export class CarAllotmentDialogComponent {
  private destroyed$ = new Subject<void>();
  carAllotmentForm!:FormGroup;
  carType: any = [
    {
      name: 'Dzire (4 + 1 persons)',
      cost: 120,
    },
    {
      name: 'Altis (4 + 1 persons) ',
      cost: 300,
    },
    {
      name: 'Innova Crysta (5 +1  persons) ',
      cost: 250,
    },
    {
      name: 'Fortuner (5 +1  persons) ',
      cost: 600,
    },
    {
      name: 'Honda City (4 +1  persons)',
      cost: 170,
    },
    {
      name: 'Mercedes (4 +1  persons)',
      cost: 1000,
    },
    {
      name: 'Ertiga (5 + 1 persons) ',
      cost: 900,
    },
    {
      name: 'Winger (13 + 1 seater) ',
      cost: 500,
    },
    {
      name: 'Traveler (25 + 1 seater) ',
      cost: 2000,
    },
  ];
  costOfCar: number = 0;
  constructor(public fb: FormBuilder,
    public dialogRef: MatDialogRef<CarAllotmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  
  ngOnInit(): void {
    console.log(this.data);
    this.initiateForm();
    if(this.data[0].carNo){
      this.carAllotmentForm.patchValue(this.data[0])
    }
    
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  initiateForm() {
    this.carAllotmentForm = this.fb.group({
      carNo: [''],
      driverName: [''],
      driverContactNo: [''],
    });
  }
  onSelectCar(event: any) {
    console.log("this.costOfCar",event);
    this.carAllotmentForm.controls['costOfCar'].patchValue(
    this.carType.filter(
      (value: any) => value.name == event.value
    )[0].cost);
    //console.log(this.carType.filter((value:any)=>value.name==event.detail.value));
  }
  onCancle(){
    this.carAllotmentForm.reset();
    this.dialogRef.close(false);
  }
  onAllotCar(){
    this.dialogRef.close(this.carAllotmentForm.value);
  }
}
