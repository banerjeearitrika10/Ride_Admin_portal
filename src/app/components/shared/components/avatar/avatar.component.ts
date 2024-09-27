import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnChanges {

  @Input() name!: string;

  initial: string = "";

  ngOnChanges(changes: SimpleChanges): void {
    this.initial = this.name ? this.name.charAt(0).toUpperCase() : "";
  }

}
