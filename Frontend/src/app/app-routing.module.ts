import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/loginPage/login/login.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { authGuard } from './guards/auth.guard';
import { FilePageComponent } from './components/file/file-page/file-page.component';
import { FileUploadComponent } from './components/file/file-upload/file-upload.component';
import { EmployeeProfileComponent } from './components/employee-profile/employee-profile.component';
import { CrudEntityPageComponent } from './components/crud-entity-page/crud-entity-page.component';
import { ModuleComponent } from './components/module/module.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent,},
  { path: 'file', component: FilePageComponent, canActivate:[authGuard]},
  { path: 'home', component: HomePageComponent, canActivate:[authGuard],},
  { path: 'module', component: ModuleComponent, canActivate:[authGuard],},
  { path: 'fileUpload', component: FileUploadComponent, canActivate:[authGuard]},
  { path: 'employee/:id', component: EmployeeProfileComponent, canActivate:[authGuard]},
  { path: 'administration', component: CrudEntityPageComponent, canActivate:[authGuard],},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
