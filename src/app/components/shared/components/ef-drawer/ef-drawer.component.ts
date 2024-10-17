import { Component, ContentChild, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-ef-drawer',
    templateUrl: './ef-drawer.component.html',
    styleUrls: ['./ef-drawer.component.scss']
})
export class EfDrawerComponent {

    @Input() isOpen: boolean = false;
    @Output() onClose = new EventEmitter();

    @ContentChild('drwrFooter') drwrFooter!: ElementRef;

    constructor() {
        // console.log(this.drwrFooter);
    }

    doClose() {
        this.onClose.emit();
    }
}
