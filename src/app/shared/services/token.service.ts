import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { API } from '../configuration/endpoints';

import { tap } from 'rxjs/operators';

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly _appUser = environment.smcAppUser;
  private readonly _appPass = environment.smcAppPass;

  _tokenIsValid: boolean = false;

  constructor(private httpClient: HttpClient) {}

  public saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  public clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  public get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public getNewToken() {
    const body = {
      user: this._appUser,
      password: this._appPass,
    };

    const options: any = {
      responseType: 'text' as const,
    };
    return this.httpClient
      .post<string>(`${API.auth.loginApp}/token`, body, options)
      .pipe(
        tap({
          next: (token: any) => {
            this.saveToken(token);
          },
        })
      );
  }
}
