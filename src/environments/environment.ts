/*
export const environment = {
  production: true,
  apiUrl: 'http://localhost:4200',
};
*/

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
// export const environment = {
//   production: false,
//   url: 'https://identity.carpool.letscover360.com',
//   realm: 'carpool',
//   clientId: 'web-client',
// };
import { DefaultEnvironmentConfig } from "./default.env";

class DevelopmentEnvironmentConfig extends DefaultEnvironmentConfig {
  override production= false;
}

export const environment = new DevelopmentEnvironmentConfig();