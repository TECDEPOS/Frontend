import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from '@angular/material/icon'
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/loginPage/login/login.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NavBarComponent } from './components/Misc/nav-bar/nav-bar.component';
import { ErrorPopupComponent } from './components/pop-ups/error-popup/error-popup.component';
import { FilePageComponent } from './components/file/file-page/file-page.component';
import { FileUploadComponent } from './components/file/file-upload/file-upload.component';
import { CrudEntityPageComponent } from './components/crud-entity-page/crud-entity-page.component';
import { CreateComponent } from './components/crud-entitys/create/create.component';
import { EditComponent } from './components/crud-entitys/edit/edit.component';
import { EmployeeProfileComponent } from './components/employee-profile/employee-profile.component';
import { ChangePasswordPopupComponent } from './components/pop-ups/change-password-popup/change-password-popup.component';
import { FileuploadPopupComponent } from './components/pop-ups/fileupload-popup/fileupload-popup.component';
import { AddPersonmodulePopupComponent } from './components/pop-ups/add-personmodule-popup/add-personmodule-popup.component';
import { EditPersonmodulePopupComponent } from './components/pop-ups/edit-personmodule-popup/edit-personmodule-popup.component';



export function tokenGetter() {
  return localStorage.getItem("jwt");
}

// Custom date formatting, used as value for MAT_DATE_FORMATS in providers
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'D.MM.YY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomePageComponent,
    NavBarComponent,
    ErrorPopupComponent,
    FilePageComponent,
    FileUploadComponent,
    CrudEntityPageComponent,
    CreateComponent,
    EditComponent,
    EmployeeProfileComponent,
    FileuploadPopupComponent,
    ChangePasswordPopupComponent,
    AddPersonmodulePopupComponent,
    EditPersonmodulePopupComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    HttpClientModule,
    MatSelectModule,
    FormsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSortModule,
    MatTabsModule,
    MomentDateModule,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        disallowedRoutes: []
      }
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true,
  },
  { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true } },
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
