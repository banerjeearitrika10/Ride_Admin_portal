import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { DecodeToken } from '../util/token-decod.util';

@Injectable({ providedIn: 'root' })
export class AuthService {



  constructor(
    // private oidcSecurityService: OidcSecurityService,
    private keycloakService: KeycloakService,
    private router: Router,
    private decodeToken: DecodeToken
  ) {

  }


  public checkAuth(url?: string) {
    return this.keycloakService.isLoggedIn();
  }

  public login() {
    this.keycloakService.login();
  }

  public logout() { this.keycloakService.logout(); }
  public refresh() { this.keycloakService.updateToken() }

  // These normally won't be exposed from a service like this, but
  // for debugging it makes sense.
  public async accessToken() { return await this.keycloakService.getToken(); }
  public get refreshToken(): string { return ''; }
  public get idToken() { return this.keycloakService.getToken() }
  public async roles() {
    return this.decodeToken.decodeToken(await this.accessToken()).realm_access.roles;
  }

  public async permissions() : Promise<string[]>{
    let allPermissions: any = this.decodeToken.decodeToken(await this.accessToken()).resource_access;
    let permissions: string[] = [];
    for (let permission in allPermissions) {
      permissions = [...permissions, ...allPermissions[permission]['roles']];
    }
    return permissions;
  }

  public async userType(): Promise<string> {
    return this.decodeToken.decodeToken(await this.accessToken()).userType;
  }

  public async managePartner(): Promise<string[]> {
    return this.decodeToken.decodeToken(await this.accessToken()).managePartners;
  }

  public async decodedToken() {

    return await this.decodeToken.decodeToken(await this.accessToken());

  }

  public async userName(){
    return await this.decodeToken.decodeToken(await this.accessToken()).preferred_username;
  }
}
