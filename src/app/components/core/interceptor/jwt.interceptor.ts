// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { AuthService } from '../../services/auth.service';


// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//   constructor(private authenticationService: AuthService) {}

//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     // add authorization header with jwt token if available
//     // const currentUser = this.authenticationService.currentUserValue;
//     this.authenticationService.getToken().then((token) => {
//       console.log('Extracted Token:', token);
//       if (token) {
//         request = request.clone({
//           setHeaders: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       }
//     });
   

//     return next.handle(request);
//   }
// }
// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
// } from '@angular/common/http';
// import { Observable, from } from 'rxjs';
// import { switchMap } from 'rxjs/operators';
// import { AuthService } from '../../services/auth.service';

// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//   constructor(private authenticationService: AuthService) {}

//   intercept(
//     request: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     // Use `from()` to convert the promise to an observable
//     return from(this.authenticationService.getToken()).pipe(
//       switchMap((token) => {
//         if (token) {
//           // Clone the request and add the Authorization header
//           request = request.clone({
//             setHeaders: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//         }
//         // Pass the modified request to the next handler
//         return next.handle(request);
//       })
//     );
//   }
// }
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const currentUser = localStorage.getItem('currentUserToken');
    
    if (currentUser && currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser}`,
        },
      });
    }

    return next.handle(request);
  }
}
