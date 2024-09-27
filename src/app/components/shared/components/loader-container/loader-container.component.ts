import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loader-container',
  templateUrl: './loader-container.component.html',
  styleUrls: ['./loader-container.component.scss']
})
export class LoaderContainerComponent {
  @Input() public isLoading: boolean = false;
}
