import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { AuthenticatedResponse } from '../Models/ViewModels/AuthenticatedResponse';
import { MatDialog } from '@angular/material/dialog';
import { ErrorPopupComponent } from '../components/pop-ups/error-popup/error-popup.component';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService, private route: Router, private dialog: MatDialog) { }

  // This needs to match the BadRequest string when checking for RefreshToken's expiration, Look at the 'RefreshToken' method in the AuthController found in the backend.
  sessionExpiredError: string = 'Your session has expired, please log in again.'


  // Modifies every HTTP request sent and adds the access token required to the header before sending it to the server.
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authService.getAccessToken()) {
      request = this.addToken(request, this.authService.getAccessToken()!);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && error.error === this.sessionExpiredError) {
          this.sessionExpiredPopup(error);
          return throwError(() => error)
        }
        else if (error instanceof HttpErrorResponse && error.status !== 401) {
          this.openErrorPopup(error)
          return throwError(() => error);
        }
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      let authResponse = new AuthenticatedResponse;
      authResponse.refreshToken = this.authService.getRefreshToken()!;
      authResponse.userId = this.authService.getUserId();

      return this.authService.renewToken(authResponse).pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          // Store new AccessToken and RefreshToken
          this.authService.storeAccessToken(token['accessToken']);
          this.authService.storeRefreshToken(token['refreshToken']);

          this.refreshTokenSubject.next(token['accessToken']);
          return next.handle(this.addToken(request, token['accessToken']));
        }),
        catchError((err) => {
          if (err.error == this.sessionExpiredError) {
            this.sessionExpiredPopup(err);
          }
          else {
            this.openErrorPopup(err)
          }
          return throwError(() => {

          })
        })
      )
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt));
        }),
        catchError((err) => {
          if (err.error == this.sessionExpiredError) {
            this.sessionExpiredPopup(err);
          }
          else {
            this.openErrorPopup(err)
          }
          return throwError(() => err)
        })
      );
    }
  }

  sessionExpiredPopup(err: any) {
    if (this.dialog.openDialogs.filter(x => x.componentInstance.data?.message == err.error).length == 0) {
      this.dialog.open(ErrorPopupComponent, {
        data: {
          icon: 'Error',
          message: err.error,
          sessionExpired: true
        }
      })
    }
  }


  openErrorPopup(err: any) {
    console.log(err);
    let errorMessage;
    if (err.error?.title !== null && err.error?.title !== undefined) {
      errorMessage = err.error.title;
    }
    else{
      errorMessage = err.error;
    }
    
    if (this.dialog.openDialogs.filter(x => x.componentInstance.data?.message == err.error).length == 0){
      this.dialog.open(ErrorPopupComponent, {
        data: {
          icon: 'Error',
          message: errorMessage
        },
        maxWidth: '50%'
      }) 
    }
  }
}

export const tokenInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true
};