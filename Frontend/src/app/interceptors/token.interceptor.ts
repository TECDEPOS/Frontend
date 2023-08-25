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
import { MatDialog } from '@angular/material/dialog';
import { ErrorPopupComponent } from '../components/pop-ups/error-popup/error-popup.component';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private route: Router, private dialog: MatDialog) {}

  // This needs to match the BadRequest string when checking for RefreshToken's expiration, Look at the 'RefreshToken' method in the AuthController found in the backend.
  sessionExpiredError: string = 'Your session has expired, please log in again.'

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
          else if (err.error !== this.sessionExpiredError){
            this.openErrorPopup(err)
          }
        }        
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
    // Get new access token and refresh token
    return this.authService.renewToken(authResponse)
      .pipe(
        switchMap((data: AuthenticatedResponse) => {
          this.authService.storeAccessToken(data.accessToken);
          this.authService.storeRefreshToken(data.refreshToken);
          req = req.clone({
            setHeaders: { Authorization: `Bearer ${data.accessToken}` }
          })
          // Resend the initial request
          return next.handle(req);
        }),
        catchError((err) => {
          if (err.error == this.sessionExpiredError) {
            this.sessionExpiredPopup(err);
          }
          else{
            this.openErrorPopup(err)
          }          
          return throwError(() => {
            
          })
        })
  )}

  // A popup with the error message, clicking 'Okay' closes the popup.
  openErrorPopup(err: any){
    this.dialog.open(ErrorPopupComponent, {
      data: {
        icon: 'Error',
        message: err.error
      }
    })
  }

  // A popup with the error message, clicking 'Okay' logs the user out.
  sessionExpiredPopup(err: any){
    this.dialog.open(ErrorPopupComponent, {
      data: {
        icon: 'Error',
        message: err.error,
        sessionExpired: true
      }
    })
  }
}
