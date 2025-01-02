import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { AuthUtil } from '../util/auth.util';
import { AuthService } from './auth.service';
import { DeactivationGuard } from './deactivation.guard';



@Injectable({ providedIn: 'root' })
export class CarpoolAuthGuard extends KeycloakAuthGuard implements CanActivateChild{
  constructor(
    private authService: AuthService,
    private authUtil: AuthUtil,
    protected override readonly router: Router,
    protected readonly keycloak: KeycloakService
  ) { 
    super(router, keycloak);
  }

  public async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    // Force the user to log in if currently unauthenticated.
    if (!this.authenticated) {
      await this.keycloak.login({
        redirectUri: window.location.origin + state.url,
      });
    }
    await this.authService.userType().then((uType)=>{
      //alert(uType);
      if(uType && uType.toUpperCase() !== 'OSS'){
        this.authService.logout();
      }
    })
    // Get the roles required from the route.
    const requiredRoles = route.data['roles'];

    // Allow the user to to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return true;
    }

    // Allow the user to proceed if all the required roles are present.
    return requiredRoles.every(async (role) => (await this.authService.permissions()).includes(role));
  }

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Observable<boolean> | Promise<boolean> | boolean{
  //   return this.authService.checkAuth()
  //       .pipe(map( (x)=> {
  //           if (!x) {
  //           this.authService.login(); 
  //           return false;
  //         }
          
  //         return this.authUtil.checkRoleForEachUrl(state, this.authService.roles);
  //       }));
  // }

  override canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree>{
     return super.canActivate(route,state).then(async response=>{
       if(response){
        return this.authUtil.checkRoleForEachUrl(state, await this.authService.permissions());
       }
       else{
         return false;
       }
     })
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>| Promise<boolean|UrlTree> | boolean{
    return this.canActivate(route,state);
  }

  canDeactivate(component: DeactivationGuard):  Observable<boolean> | Promise<boolean> | boolean {
    return component.canDeactivate ? component.canDeactivate() : true;
  }

}
