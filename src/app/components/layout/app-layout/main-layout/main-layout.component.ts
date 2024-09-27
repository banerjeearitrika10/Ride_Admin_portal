import { Direction } from '@angular/cdk/bidi';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DirectionService } from '../../../core/service/direction.service';
import { ConfigService } from '../../../config/config.service';
import { InConfiguration } from '../../../core/models/config.interface';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: [],
})
export class MainLayoutComponent {
  direction!: Direction;
  public config!: InConfiguration;
  isVisible: boolean = true
  constructor(
    private directoryService: DirectionService,
    private configService: ConfigService,
    private router : Router
  ) {
    this.config = this.configService.configData;
    this.directoryService.currentData.subscribe((currentData) => {
      if (currentData) {
        this.direction = currentData === 'ltr' ? 'ltr' : 'rtl';
      } else {
        if (localStorage.getItem('isRtl')) {
          if (localStorage.getItem('isRtl') === 'true') {
            this.direction = 'rtl';
          } else if (localStorage.getItem('isRtl') === 'false') {
            this.direction = 'ltr';
          }
        } else {
          if (this.config) {
            if (this.config.layout.rtl === true) {
              this.direction = 'rtl';
              localStorage.setItem('isRtl', 'true');
            } else {
              this.direction = 'ltr';
              localStorage.setItem('isRtl', 'false');
            }
          }
        }
      }
    });
   
  }
}
