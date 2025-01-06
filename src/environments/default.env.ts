export class DefaultEnvironmentConfig {
    production = true;

    rootApiUrl = 'https://api.carpool.letscover360.com';

    get authConfig() {
        return {
            url: 'https://identity.carpool.letscover360.com',
            realm: 'carpool',
            clientId: 'web-client',
        }
    }


    get allowedUrls() {
        return [this.rootApiUrl];
    }

    get bookingService() {
        return `${this.rootApiUrl}`;
    }

}
