import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../Models/Course';
import { Person } from '../Models/Person';

@Injectable({
  providedIn: 'root'
})
export class PersonModuleService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;

  getAllPersonModules(): Observable<Course[]>{
    return this.http.get<Course[]>(this.baseApiUrl + 'PersonModule');
  }

  getPersonModule(personModuleId: number): Observable<Course>{
    return this.http.get<Course>(this.baseApiUrl + 'PersonModule/' + personModuleId)
  }

  getPersonModules(personId: number, moduleId: number): Observable<Course[]>{
    return this.http.get<Course[]>(this.baseApiUrl + 'PersonModule/' + personId + '/' + moduleId)
  }

  getPersonModulesByPerson(personId: number): Observable<Course[]>{
    return this.http.get<Course[]>(this.baseApiUrl + 'PersonModule/person/' + personId);
  }
  
  addPersonModules(personModule: Course): Observable<Course>{
    return this.http.post<Course>(this.baseApiUrl + 'PersonModule/', personModule)
  }

  updatepersonModules(personModule: Course): Observable<Course>{
    return this.http.put<Course>(this.baseApiUrl + 'PersonModule/', personModule)
  }

  deletePersonModule(personModuleId: number): Observable<Course>{
    return this.http.delete<Course>(this.baseApiUrl + 'PersonModule/' + personModuleId)
  }
}
