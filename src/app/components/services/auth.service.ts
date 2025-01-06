import { Injectable } from '@angular/core';
import Keycloak, { KeycloakInstance } from 'keycloak-js';
import { DecodeToken } from '../util/token-decod.util';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private keycloak: KeycloakInstance;

  constructor(private decodeToken: DecodeToken) {
    this.keycloak =  new Keycloak({
      url: environment.authConfig.url, // Replace with your Keycloak server URL
      realm: environment.authConfig.realm,                     // Replace with your realm
      clientId: environment.authConfig.clientId,      
      
    });
  }

  // Initialize Keycloak
  async init(): Promise<boolean> {
    return this.keycloak.init({ onLoad: 'check-sso', pkceMethod: 'S256' ,checkLoginIframe: false});
  }

  // Login using In-App Browser
  async login(): Promise<void> {
      this.keycloak.login();
  }

  // Handle callback after login
  async handleCallback(url: string): Promise<void> {
    const result = this.keycloak.parseCallback(url);
    if (result) {
      console.log('Login successful:', result);
    } else {
      console.error('Login failed');
    }
  }

  // Logout using In-App Browser
  async logout(): Promise<void> {
    this.keycloak.logout();
  }

  // Get Token
  async getToken(): Promise<string> {
    return this.keycloak.token || '';
  }
   getParseToken():any{
    return this.keycloak.tokenParsed;
  }
  scheduleTokenRefresh() {
    // Check and update the token every minute (60 seconds)
    setInterval(() => {
      this.keycloak.updateToken(30) // Update token if it will expire in 30 seconds
        .then(refreshed => {
          if (refreshed) {
            console.log('Token was successfully refreshed:', this.keycloak.token);
          } else {
            console.log('Token is still valid.');
          }
        })
        .catch(err => {
          console.error('Failed to refresh token:', err);
          this.keycloak.logout(); // Optionally, log the user out if token refresh fails
        });
    }, 60000); // 60 seconds interval
  }
}
