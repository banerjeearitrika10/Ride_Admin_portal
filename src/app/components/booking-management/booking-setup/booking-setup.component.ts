import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

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
        items: ['booking-setup'],
        active: 'Booking Setup',
      },
    ],
    'create': [
      {
        title: 'Dashboard',
        items: ['booking-setup'],
        active: 'Create',
      },
    ],
    'view': [
      {
        title: 'Dashboard',
        items: ['booking-setup'],
        active: 'View',
      },
    ],
    'edit': [
      {
        title: 'Dashboard',
        items: ['booking-setup'],
        active: 'Edit',
      },
    ]
  };
 private destroyed$ = new Subject<void>();
  defaultView: string = "list"
  hiddenFilterButton=false;
  isOpen: boolean = false;
  constructor(private activeRoute: ActivatedRoute){}
  ngOnInit():void{
    this.activeRoute.queryParams.subscribe(p => this.defaultView = p['mode'] || "list");
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
    //     this.organizationService.emitSearchDataForFilter(response);
    //   } 
      
    // });

  }
  refreshTable(){
    this.hiddenFilterButton=false;
    // this.dataFromFilterDialog = {};
    // this.organizationService.emitSearchDataForFilter({})
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
