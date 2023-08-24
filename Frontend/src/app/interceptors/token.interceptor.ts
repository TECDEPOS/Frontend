import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { AuthenticatedResponse } from '../Models/ViewModels/AuthenticatedResponse';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private route: Router) {}

  // Modifies every HTTP request sent and adds the access token required to the header before sending it to the server.
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.authService.getAccessToken();

    if (myToken) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${myToken}` }
      })
    }
    return next.handle(request).pipe(
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            return this.handleUnAuthorizedError(request, next);
          }
        }
        console.log('yo what up that error was not a 401');
        
        return throwError(() => err)
      })
    );
  }

  // Attempts to get a new access token and re-sends the previous request
  handleUnAuthorizedError(req: HttpRequest<any>, next: HttpHandler) {
    let authResponse = new AuthenticatedResponse();
    authResponse.accessToken = this.authService.getAccessToken()!;
    authResponse.refreshToken = this.authService.getRefreshToken()!;
    authResponse.userId = this.authService.getUserId();
    // authResponse.userId = Number(localStorage.getItem('userid'));
    return this.authService.renewToken(authResponse)
      .pipe(
        switchMap((data: AuthenticatedResponse) => {
          this.authService.storeAccessToken(data.accessToken);
          this.authService.storeRefreshToken(data.refreshToken);
          req = req.clone({
            setHeaders: { Authorization: `Bearer ${data.accessToken}` }
          })
          console.log('resending request');
          
          return next.handle(req);
        }),
        catchError((err) => {
          console.log('TESTCHEESE      ',err.error);
          
          return throwError(() => {
            //What happens if we don't log them out?
            console.log('TOKEN EXPIRED');
            // this.authService.renewToken(authResponse);
            this.route.navigate(['/login'])
          })
        })
      )
  }
}
