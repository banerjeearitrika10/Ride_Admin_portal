export class DefaultEnvironmentConfig {
    production = true;

    rootApiUrl = 'https://api.dev.examfactor.co';

    get authConfig() {
        return {
            //issuer: 'https://demo.identityserver.io',
            issuer: 'https://identity.dev.examfactor.co',
            realm: 'exam-factor',
            clientId: 'web-client', // The "Auth Code + PKCE" client
            responseType: 'code',
            redirectUri: `${window.location.href}?_=123`,
            silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html',
            scope: 'openid profile email roles phone', // Ask offline_access to support refresh token refreshes
            useSilentRefresh: true, // Needed for Code Flow to suggest using iframe-based refreshes
            sessionChecksEnabled: true,
            showDebugInformation: true, // Also requires enabling "Verbose" level in devtools
            clearHashAfterLogin: false, // https://github.com/manfredsteyer/angular-oauth2-oidc/issues/457#issuecomment-431807040,
            nonceStateSeparator: 'semicolon', // Real semicolon gets mangled by IdentityServer's URI encoding
        }
    }


    get allowedUrls() {
        return [this.rootApiUrl];
    }

    get masterDataService() {
        return `${this.rootApiUrl}/master-data-service`;
    }

   
}
