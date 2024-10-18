import { Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { IEmpFilter } from '../../services/models/employee';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-employee-landing',
  templateUrl: './employee-landing.component.html',
  styleUrl: './employee-landing.component.scss'
})
export class EmployeeLandingComponent {
  breadscrums = {
    'list': [
      {
        title: 'Dashboard',
        items: ['employee'],
        active: 'Employee',
      },
    ]
  };
  dataFromFilterDialog!: IEmpFilter;
 private destroyed$ = new Subject<void>();
  defaultView: string = "list";
  inputFieldForSearch = new FormControl('');
  hiddenFilterButton=false;
  isOpen: boolean = false;
  constructor(private activeRoute: ActivatedRoute,public dialog: MatDialog,public empService:EmployeeService){}
  ngOnInit():void{
    this.activeRoute.queryParams.subscribe(p => this.defaultView = p['mode'] || "list");
    this.inputFieldForSearch.valueChanges.pipe(takeUntil(this.destroyed$), debounceTime(1000)).subscribe(selectedValue => {
      this.empService.emitSearchKey(selectedValue as string);
      
    });
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  openFilterDialog(){
    // const dialogRef = this.dialog.open(FilterDialogComponent, {
    //   width: '20%',
    //   disableClose: true,
    //   autoFocus: false,
    //   data: this.dataFromFilterDialog ? this.dataFromFilterDialog : {}
    // });
    // dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
    //   if (response) {
    //     this.dataFromFilterDialog = response;
    //     this.hiddenFilterButton=true;
    //     this.empService.emitSearchDataForFilter(response);
    //   } 
      
    // });

  }
  refreshTable(){
    this.hiddenFilterButton=false;
    this.dataFromFilterDialog = {};
    this.empService.emitSearchDataForFilter({})
  }
  onOpenDrawer() {
    this.isOpen = true;
}

onCloseDrawer(ev: any) {
    this.isOpen = false;
}
}
