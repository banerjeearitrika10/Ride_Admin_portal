import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import { IFilter } from '../../services/models/booking';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-setup',
  templateUrl: './booking-setup.component.html',
  styleUrl: './booking-setup.component.scss'
})
export class BookingSetupComponent {
  breadscrums = {
    'list': [
      {
        title: 'Dashboard',
        items: ['booking'],
        active: 'Booking Details',
      },
    ]
  };
  dataFromFilterDialog!: IFilter;
 private destroyed$ = new Subject<void>();
  defaultView: string = "list"
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
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '20%',
      disableClose: true,
      autoFocus: false,
      data: this.dataFromFilterDialog ? this.dataFromFilterDialog : {}
    });
    dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe(response => {
      if (response) {
        this.dataFromFilterDialog = response;
        this.hiddenFilterButton=true;
        this.bookingService.emitSearchDataForFilter(response);
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

    // if (ev === 'refresh') {
    //     this.studentDirectoryService.setData(ev);
    // }
}
}
