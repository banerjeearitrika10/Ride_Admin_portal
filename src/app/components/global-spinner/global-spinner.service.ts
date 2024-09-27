import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GlobalSpinnerService {

    public isLoading = new BehaviorSubject(false);
    public isCustomisedloading = new BehaviorSubject(false);
    constructor() { }
}