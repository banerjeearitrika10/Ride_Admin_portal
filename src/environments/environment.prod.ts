// export const environment = {
//   production: true,
//   url: 'https://identity.carpool.letscover360.com',
//   realm: 'carpool',
//   clientId: 'web-client',

import { DefaultEnvironmentConfig } from "./default.env";

// };
class ProductionEnvironmentConfig extends DefaultEnvironmentConfig {
  override production= true;
  // apiUrl= 'https://lms.examfactor.com';
  // apiEndpoint='';
}

export const environment = new ProductionEnvironmentConfig();
