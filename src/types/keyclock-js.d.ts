declare module 'keycloak-js' {
  export interface KeycloakInitOptions {
    onLoad?: 'login-required' | 'check-sso';
    checkLoginIframe?: boolean;
    checkLoginIframeInterval?: number;
    pkceMethod?: 'S256';
    responseMode?: 'query' | 'fragment';
    flow?: 'standard' | 'implicit' | 'hybrid';
    enableLogging?: boolean;
  }

  export interface KeycloakLoginOptions {
    redirectUri?: string;
    prompt?: string;
    maxAge?: number;
    loginHint?: string;
    idpHint?: string;
    scope?: string;
    locale?: string;
  }

  export interface KeycloakLogoutOptions {
    redirectUri?: string;
  }

  export interface KeycloakCallbackResult {
    code?: string; // Authorization code for 'code' flow
    error?: string; // Error message if an error occurred
    prompt?: string; // Optional prompt value from callback
    fragment?: string; // Raw fragment string (if applicable)
  }

  export interface KeycloakInstance {
    init(options?: KeycloakInitOptions): Promise<boolean>;
    login(options?: KeycloakLoginOptions): Promise<void>;
    logout(options?: KeycloakLogoutOptions): Promise<void>;
    createLoginUrl(options?: KeycloakLoginOptions): string;
    createLogoutUrl(options?: KeycloakLogoutOptions): string;
    loadUserProfile(): Promise<KeycloakProfile>;
    updateToken(minValidity: number): Promise<boolean>;
    hasRealmRole(role: string): boolean;
    hasResourceRole(role: string, resource?: string): boolean;
    token?: string;
    tokenParsed?: KeycloakTokenParsed;
    refreshToken?: string;
    authenticated?: boolean;

    /**
     * Parses the callback URL and returns information about the authentication result.
     * Typically used when handling OAuth callback responses.
     */
    parseCallback(url: string): KeycloakCallbackResult | undefined;
  }

  export interface KeycloakProfile {
    id?: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    enabled?: boolean;
    emailVerified?: boolean;
  }

  export interface KeycloakTokenParsed {
    exp?: number;
    iat?: number;
    auth_time?: number;
    nonce?: string;
    sub?: string;
    session_state?: string;
    realm_access?: {
      roles: string[];
    };
    resource_access?: {
      [key: string]: {
        roles: string[];
      };
    };
  }

  // Use `new` keyword to create an instance of Keycloak
  interface KeycloakConstructor {
    new (config?: any): KeycloakInstance;
  }

  const Keycloak: KeycloakConstructor;
  export default Keycloak;
}
