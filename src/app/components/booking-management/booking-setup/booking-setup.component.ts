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
        active: '',
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
  constructor(private activeRoute: ActivatedRoute){}
  ngOnInit():void{
    this.activeRoute.queryParams.subscribe(p => this.defaultView = p['mode'] || "list");
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
