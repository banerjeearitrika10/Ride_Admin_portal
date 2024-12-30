import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.authConfig.issuer,
        realm: environment.authConfig.realm,
        clientId: environment.authConfig.clientId,
      },
      bearerExcludedUrls: ['/assets'],
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}
@NgModule({
  imports: [
    HttpClientModule,
    KeycloakAngularModule
  ],
  providers: [
    AuthService,
  ],
})
export class ExamFactorAuthModule {
  static forRoot(): ModuleWithProviders<ExamFactorAuthModule> {
    return {
      ngModule: ExamFactorAuthModule,
      providers: [
        // { provide: AuthConfig, useValue: authConfig },
        // { provide: OAuthModuleConfig, useValue: authModuleConfig },
        // { provide: OAuthStorage, useFactory: storageFactory },
        // OidcConfigService,
        // {
        //   provide: APP_INITIALIZER,
        //   useFactory: configureAuth,
        //   deps: [OidcConfigService],
        //   multi: true,
        // },
        {
          provide: APP_INITIALIZER,
          useFactory: initializeKeycloak,
          multi: true,
          deps: [KeycloakService],
        }
      ]
    };
  }

  constructor(@Optional() @SkipSelf() parentModule: ExamFactorAuthModule) {
    if (parentModule) {
      throw new Error('ExamFactorAuthModule is already loaded. Import it in the AppModule only');
    }
  }
}
