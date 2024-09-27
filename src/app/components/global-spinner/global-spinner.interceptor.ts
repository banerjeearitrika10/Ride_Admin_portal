import { Injectable } from '@angular/core';
import {
    HttpResponse,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { GlobalSpinnerService } from './global-spinner.service';

@Injectable()
export class GlobalSpinnerInterceptor implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];

    constructor(private loaderService: GlobalSpinnerService) { }

    removeRequest(req: HttpRequest<any>) {
        if (req.url.indexOf('templateRequests') === -1) {
            const i = this.requests.indexOf(req);
            if (i >= 0) {
                this.requests.splice(i, 1);
            }


            this.loaderService.isLoading.next(this.requests.length > 0);
        }
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.url.indexOf('templateRequests') === -1) {
            this.requests.push(req);

            // console.log("No of requests--->" + this.requests.length);


            this.loaderService.isLoading.next(true);
        }
        return Observable.create(observer => {
            const subscription = next.handle(req)
                .subscribe(
                    event => {
                        if (event instanceof HttpResponse) {
                            this.removeRequest(req);
                            observer.next(event);
                        }
                    },
                    err => {
                        console.warn('error' + err);
                        this.removeRequest(req);
                        observer.error(err);
                    },
                    () => {
                        this.removeRequest(req);
                        observer.complete();
                    });
            // remove request from queue when cancelled
            return () => {
                this.removeRequest(req);
                subscription.unsubscribe();
            };
        });
    }
}
