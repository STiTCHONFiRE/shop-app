import {Injectable} from '@angular/core';
import {AuthConfig, OAuthService} from "angular-oauth2-oidc";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private oauthService: OAuthService) {
    const authConfig: AuthConfig = {
      issuer: 'http://localhost:9000',
      redirectUri: 'http://localhost:4200',
      clientId: 'client',
      responseType: 'code',
      scope: 'openid profile',
      showDebugInformation: true
    };

    this.oauthService.configure(authConfig);

  }

  loadConfig() {
    return this.oauthService.loadDiscoveryDocumentAndTryLogin().then().catch(() => this.oauthService.logOut());
  }

  public login() {
    this.oauthService.initCodeFlow();
  }

  public isAdmin(): boolean {
    return (this.oauthService.getIdentityClaims()['authorities'] as string[]).lastIndexOf("admin") > -1
  }

  public logout() {
    this.oauthService.logOut();
    window.location.href = `http://localhost:9000/logout`;
  }

  public isAuth(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  public getUser() {
    return this.oauthService.getIdentityClaims();
  }
}
