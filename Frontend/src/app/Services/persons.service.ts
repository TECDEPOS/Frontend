import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs'
import { Person } from '../Models/Person';

@Injectable({
  providedIn: 'root'
})
export class PersonsService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;

  getPerson(): Observable<Person[]>{
    return this.http.get<Person[]>(this.baseApiUrl + 'Person/')
  }

  getPersonById(id: number): Observable<Person>{
    return this.http.get<Person>(this.baseApiUrl + 'Person/' + id)
  }

  getPersonByName(name: string): Observable<Person[]>{
    return this.http.get<Person[]>(this.baseApiUrl + 'Person/' + name)
  }

  addPerson(person: Person): Observable<Person>{
    return this.http.post<Person>(this.baseApiUrl + 'Person/', person)
  }

  updatePerson(person: Person): Observable<Person>{
    return this.http.put<Person>(this.baseApiUrl + 'Person/', person)
  }

  deletePerson(id: number): Observable<Person>{
    return this.http.delete<Person>(this.baseApiUrl + 'Person/' + id)
  }

}
