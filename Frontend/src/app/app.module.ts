import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'
import { MatNativeDateModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { MomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './interceptors/token.interceptor';

import { AddPersonCourseComponent } from './components/pop-ups/add-person-course/add-person-course.component';
import { AppComponent } from './app.component';
import { ChangePasswordPopupComponent } from './components/pop-ups/change-password-popup/change-password-popup.component';
import { ConfirmationPopupComponent } from './components/pop-ups/confirmation-popup/confirmation-popup.component';
import { CoursePageComponent } from './components/courses/course-page/course-page.component';
import { CoursesComponent } from './components/courses/courses/courses.component';
import { CreateComponent } from './components/crud-entitys/create/create.component';
import { CrudEntityPageComponent } from './components/crud-entity-page/crud-entity-page.component';
import { EditComponent } from './components/crud-entitys/edit/edit.component';
import { EditPersonmodulePopupComponent } from './components/pop-ups/edit-personmodule-popup/edit-personmodule-popup.component';
import { EmployeeProfileComponent } from './components/employee-profile/employee-profile.component';
import { ErrorPopupComponent } from './components/pop-ups/error-popup/error-popup.component';
import { FilePageComponent } from './components/file/file-page/file-page.component';
import { FileUploadComponent } from './components/file/file-upload/file-upload.component';
import { FileuploadPopupComponent } from './components/pop-ups/fileupload-popup/fileupload-popup.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/loginPage/login/login.component';
import { NavBarComponent } from './components/Misc/nav-bar/nav-bar.component';
import { ModuleComponent } from './components/module/module.component';
import { PasswordExpiredPopupComponent } from './components/pop-ups/password-expired-popup/password-expired-popup.component';
import { SnackbarIndicatorComponent } from './components/Misc/snackbar-indicator/snackbar-indicator.component';
import { FiletagMultiDropdownComponent } from './components/Misc/filetag-multi-dropdown/filetag-multi-dropdown.component';

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
    AddPersonCourseComponent,
    AppComponent,
    ChangePasswordPopupComponent,
    ConfirmationPopupComponent,
    CoursePageComponent,
    CoursesComponent,
    CreateComponent,
    CrudEntityPageComponent,
    EditComponent,
    EditPersonmodulePopupComponent,
    EmployeeProfileComponent,
    ErrorPopupComponent,
    FilePageComponent,
    FileUploadComponent,
    FileuploadPopupComponent,
    HomePageComponent,
    LoginComponent,
    NavBarComponent,
    ModuleComponent,
    PasswordExpiredPopupComponent,
    SnackbarIndicatorComponent,
    FiletagMultiDropdownComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSortModule,
    MatSnackBarModule,
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
