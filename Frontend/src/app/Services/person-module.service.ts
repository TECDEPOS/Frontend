import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PersonModule } from '../Models/PersonModule';

@Injectable({
  providedIn: 'root'
})
export class PersonModuleService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;

  getPersonModule(personId: number, moduleId: number, date: string): Observable<PersonModule>{
    return this.http.get<PersonModule>(this.baseApiUrl + 'PersonModule/' + personId + '/' + moduleId + '/' + date)
  }

  getPersonModules(personId: number, moduleId: number): Observable<PersonModule[]>{
    return this.http.get<PersonModule[]>(this.baseApiUrl + 'PersonModule/personmodules/' + personId + '/' + moduleId)
  }
  
  addPersonModules(personModule: PersonModule): Observable<PersonModule>{
    return this.http.post<PersonModule>(this.baseApiUrl + 'PersonModule/', personModule)
  }

  updatepersonModules(personModule: PersonModule): Observable<PersonModule>{
    return this.http.put<PersonModule>(this.baseApiUrl + 'PersonModule/', personModule)
  }

  deletePersonModule(personId: number, moduleId: number, date: string): Observable<PersonModule>{
    return this.http.delete<PersonModule>(this.baseApiUrl + 'PersonModule/' + personId + '/' + moduleId + '/' + date)
  }
}
