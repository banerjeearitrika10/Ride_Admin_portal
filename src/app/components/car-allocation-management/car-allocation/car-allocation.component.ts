import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-car-allocation',
  templateUrl: './car-allocation.component.html',
  styleUrl: './car-allocation.component.scss'
})
export class CarAllocationComponent {
  private destroyed$ = new Subject<void>();
  @Input() isOpen: boolean = false;
  @Input() data: any;
  @Output() onCloseDrawer = new EventEmitter();
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
  constructor(public fb: FormBuilder) { }
  
  ngOnInit(): void {
    this.initiateForm();
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  initiateForm() {
    this.carAllotmentForm = this.fb.group({
      carAllotmentDetails: this.fb.array([this.newCarAllotmentDetails()]),
    });
  }
  newCarAllotmentDetails(){
    return this.fb.group({
      carType: [''],
      costOfCar: [0],
      carNumber: [''],
      driverName: [''],
      driverContactNumber: [''],
    });
  }
  get carAllotmentDetails() {
    return this.carAllotmentForm.get('carAllotmentDetails') as FormArray;
  }
  addCarDetails() {
    if(this.carAllotmentDetails.length<this.data.carDetails.length ){
      this.carAllotmentDetails.push(this.newCarAllotmentDetails());
    }
  }
  removeCarDetails(index: number) {
    this.carAllotmentDetails.removeAt(index);
  }
  doCloseDrawer(state: string = '') {
      this.isOpen = false;
      const carDetails = this.carAllotmentForm.get('carAllotmentDetails') as FormArray;
      carDetails.clear();
      carDetails.push(this.newCarAllotmentDetails());
      this.onCloseDrawer.emit(state);
  }
  onSelectCar(event: any,i:number) {
    console.log("this.costOfCar",event);
    
    this.costOfCar = this.carType.filter(
      (value: any) => value.name == event.value
    )[0].cost;
    console.log(this.carAllotmentForm.controls['carAllotmentDetails'][i]);
    ;
    //console.log(this.carType.filter((value:any)=>value.name==event.detail.value));
  }
}
