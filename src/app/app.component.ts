import { Component } from '@angular/core';
import { Event, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AuthService } from './components/services/auth.service';
import { BookingService } from './components/services/booking.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  currentUrl!: string;
  empDetails: any;
  constructor(public _router: Router,private authService: AuthService,public bookingService : BookingService) {
    this.initializeApp();
    this._router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
        this.currentUrl = routerEvent.url.substring(
          routerEvent.url.lastIndexOf('/') + 1
        );
      }
      if (routerEvent instanceof NavigationEnd) {
        /* empty */
      }
      window.scrollTo(0, 0);
    });
  }
  initializeApp(): void {
    this.authService.init().then((authenticated) => {
      if (!authenticated) {
        this.authService.login();
      }
      else{
        this.authService.getToken().then((token) => {
          console.log('Extracted Token:', token);

            if(this.authService.getParseToken().userType != 'ADMIN'){
              this.authService.logout();
            }

          localStorage.setItem('currentUserToken', token);
          this.getEmployeeDetails();
        });
        
        console.log(this.authService.getParseToken());
        this.authService.scheduleTokenRefresh();
      }
    }).catch((err) => {
      console.error('Keycloak initialization failed', err);
    });
  }

  async  ngOnInit() {
   
  }
  getEmployeeDetails() {
    console.log(this.authService.getParseToken()?.email);
    
    let params={query:"byEmail",emailId:this.authService.getParseToken()?.email}
    this.bookingService.getEmpDetails(params).subscribe({
      next: (data)=>{
        this.empDetails = data;
        console.log(data);
        
        localStorage.setItem('empDetails',JSON.stringify(this.empDetails));
      }
    })
  }
}
