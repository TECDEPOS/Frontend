import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PersonModule } from '../Models/PersonModule';
import { Person } from '../Models/Person';

@Injectable({
  providedIn: 'root'
})
export class PersonModuleService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;

  getAllPersonModules(): Observable<PersonModule[]>{
    return this.http.get<PersonModule[]>(this.baseApiUrl + 'PersonModule');
  }

  getPersonModule(personModuleId: number): Observable<PersonModule>{
    return this.http.get<PersonModule>(this.baseApiUrl + 'PersonModule/' + personModuleId)
  }

  getPersonModules(personId: number, moduleId: number): Observable<PersonModule[]>{
    return this.http.get<PersonModule[]>(this.baseApiUrl + 'PersonModule/' + personId + '/' + moduleId)
  }

  getPersonModulesByPerson(personId: number): Observable<PersonModule[]>{
    return this.http.get<PersonModule[]>(this.baseApiUrl + 'PersonModule/person/' + personId);
  }
  
  addPersonModules(personModule: PersonModule): Observable<PersonModule>{
    return this.http.post<PersonModule>(this.baseApiUrl + 'PersonModule/', personModule)
  }

  updatepersonModules(personModule: PersonModule): Observable<PersonModule>{
    return this.http.put<PersonModule>(this.baseApiUrl + 'PersonModule/', personModule)
  }

  deletePersonModule(personModuleId: number): Observable<PersonModule>{
    return this.http.delete<PersonModule>(this.baseApiUrl + 'PersonModule/' + personModuleId)
  }
}
