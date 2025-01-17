import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, debounceTime, takeUntil } from 'rxjs';
import { AllocationFilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-request-landing',
  templateUrl: './request-landing.component.html',
  styleUrl: './request-landing.component.scss'
})
export class RequestLandingComponent {
  breadscrums = {
    'list': [
      {
        title: 'Dashboard',
        items: ['car-allotment'],
        active: 'Car Allotment',
      },
    ]
  };
  dataFromFilterDialog!: any;
 private destroyed$ = new Subject<void>();
  defaultView: string = "list";
  inputFieldForSearch = new FormControl('');
  hiddenFilterButton=false;
  isOpen: boolean = false;
  constructor(private activeRoute: ActivatedRoute,public dialog: MatDialog,public bookingService:BookingService){}
  ngOnInit():void{
    this.activeRoute.queryParams.subscribe(p => this.defaultView = p['mode'] || "list");
    
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  openFilterDialog(){
    const dialogRef = this.dialog.open(AllocationFilterDialogComponent, {
      width: '20%',
      disableClose: true,
      autoFocus: false,
      data: this.dataFromFilterDialog ? this.dataFromFilterDialog : {}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
      if (response) {
        this.dataFromFilterDialog = response;
        this.hiddenFilterButton=true;
        this.bookingService.emitAllocationSearchDataForFilter(response);
      } 
      
    });

  }
  refreshTable(){
    this.hiddenFilterButton=false;
    this.dataFromFilterDialog = {};
    this.bookingService.emitSearchDataForFilter({})
  }
  onOpenDrawer() {
    this.isOpen = true;
}

onCloseDrawer(ev: any) {
    this.isOpen = false;
}
}
