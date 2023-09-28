import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { API } from '../../shared/configuration/endpoints';
import { TokenService } from '../../shared/services/token.service';

import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private readonly maxRetry = 5;
  private retryNum = 0;

  private tokenValid = false;

  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let request = req;
    const token = this.tokenService.token;
    this.tokenValid = !!token;

    if (
      token &&
      !request.url.includes(`${API.auth.loginApp}/token`) &&
      !request.url.includes('github') &&
      !request.url.includes('ipify')
    ) {
      if (this.tokenValid) {
        request = req.clone({
          setHeaders: {
            Authorization: token,
          },
        });
      } else {
        return this.intercept(request, next).pipe(delay(1000));
      }
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (
          err instanceof HttpErrorResponse &&
          err.status == 401 &&
          !request.url.includes(`${API.auth.loginApp}/token`) &&
          this.maxRetry > this.retryNum
        ) {
          this.tokenValid = false;

          return this.handle401Error(request, next);
        }
        return throwError(err);
      })
    );
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<any> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return this.tokenService.getNewToken().pipe(
        switchMap((token: string) => {
          this.isRefreshing = false;
          const retryRequest = request.clone({
            setHeaders: {
              authorization: token,
            },
          });
          this.retryNum = 0;
          this.tokenValid = true;

          return next.handle(retryRequest);
        }),
        catchError((err: HttpErrorResponse) => {
          this.isRefreshing = false;

          if (this.retryNum < this.maxRetry) {
            this.retryNum++;

            return this.handle401Error(request, next);
          }

          return throwError(err);
        })
      );
    } else {
      return this.intercept(request, next).pipe(delay(1000));
    }
  }
}
