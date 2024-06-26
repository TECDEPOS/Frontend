import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Module } from '../Models/Module';
import { ModuleWithCourseViewModel } from '../Models/ViewModels/ModuleWithCourseViewModel';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;

  getModules(): Observable<Module[]>{
    return this.http.get<Module[]>(this.baseApiUrl + 'Module/')
  }

  getModulesWithCourse(): Observable<ModuleWithCourseViewModel[]>{
    return this.http.get<ModuleWithCourseViewModel[]>(this.baseApiUrl + 'Module/moduleswithcourse')
  }

  addModule(module: Module): Observable<Module>{
    return this.http.post<Module>(this.baseApiUrl + "Module/", module)
  }

  updateModule(module: Module): Observable<Module>{
    return this.http.put<Module>(this.baseApiUrl + 'Module/', module)
  }

  deleteModule(id: number): Observable<Module>{
    return this.http.delete<Module>(this.baseApiUrl + 'Module/' + id)
  }
}
