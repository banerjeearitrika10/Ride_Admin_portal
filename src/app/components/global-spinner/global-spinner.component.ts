// my-loader.component.ts
import { Component, OnInit } from '@angular/core';
import { GlobalSpinnerService } from './global-spinner.service';

@Component({
    selector: 'app-global-spinner',
    templateUrl: './global-spinner.component.html',
    styleUrls: ['./global-spinner.component.scss']
})
export class GlobalSpinnerComponent implements OnInit {

    loading: boolean = false;;
    customisedloading: boolean = false;

    constructor(private loaderService: GlobalSpinnerService) {

        this.loaderService.isLoading.subscribe((v) => {
            // console.log(v);
            this.loading = v;
        });

        this.loaderService.isCustomisedloading.subscribe((v) => {
            this.customisedloading = v;
        });

    }
    ngOnInit() {
    }

}
