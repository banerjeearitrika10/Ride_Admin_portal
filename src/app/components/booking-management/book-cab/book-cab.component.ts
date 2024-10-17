import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-book-cab',
  templateUrl: './book-cab.component.html',
  styleUrl: './book-cab.component.scss'
})
export class BookCabComponent {
  private destroyed$ = new Subject<void>();
  @Input() isOpen: boolean = false;
  @Output() onCloseDrawer = new EventEmitter();
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
 }

  doCloseDrawer(state: string = '') {
      this.isOpen = false;
      this.onCloseDrawer.emit(state);
  }
}
