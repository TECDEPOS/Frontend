import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Department } from '../Models/Department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;

  getDepartment(): Observable<Department[]>{
    return this.http.get<Department[]>(this.baseApiUrl + 'Departments/')
  }

  addDepartment(department: Department): Observable<Department>{
    return this.http.post<Department>(this.baseApiUrl + 'Departments/', department)
  }

  updateDepartment(department: Department): Observable<Department>{
    return this.http.put<Department>(this.baseApiUrl + 'Departments/', department)
  }

  deleteDepartment(id: number): Observable<Department>{
    return this.http.delete<Department>(this.baseApiUrl + 'Departments/' + id)
  }

}
