// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/* export const environment = {
  production: false,
  apiUrl: 'http://localhost:4200',
}; */

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.


import { DefaultEnvironmentConfig } from "./default.env";

class DevelopmentEnvironmentConfig extends DefaultEnvironmentConfig {
  override production= false;
  apiUrl= 'https://dev.examfactor.co/';
  apiEndpoint='';
  //override rootApiUrl = 'http://ac875750291f44ed08afbbace93f5a7d-36990a83063b1bb4.elb.ap-south-1.amazonaws.com';

  override get authConfig() {
    return {
      ...super.authConfig, ... {
        //issuer: 'http://43.204.250.113:8080',
        realm: 'exam-factor'
      }
    };
  }



}

export const environment = new DevelopmentEnvironmentConfig();