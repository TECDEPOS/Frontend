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

  getPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.baseApiUrl + 'Person/')
  }

  getPersonById(personId: number, roleId: number): Observable<Person> {
    return this.http.get<Person>(this.baseApiUrl + 'Person/' + personId + '/role/' + roleId)
  }

  getPersonByCourseId(courseId: number): Observable<Person[]> {
    return this.http.get<Person[]>(this.baseApiUrl + 'Person/courseId/' + courseId)
  }

  getPersonNotInCourse(courseId: number): Observable<Person[]> {
    return this.http.get<Person[]>(this.baseApiUrl + 'Person/notincourse/' + courseId)
  }

  getPersonsByDepartmentAndLocation(departmentId: number, locationId: number): Observable<Person[]> {
    return this.http.get<Person[]>(this.baseApiUrl + 'Person/departmentId/' + departmentId + '/locationId' + locationId)
  }

  getPersonByName(name: string): Observable<Person[]> {
    return this.http.get<Person[]>(this.baseApiUrl + 'Person/' + name)
  }

  getPersonsPerDepartmentFromModule(moduleId: number): Observable<any[]> {
    return this.http.get<any[]>(this.baseApiUrl + 'Person/module/' + moduleId);
  }

  addPerson(person: Person): Observable<Person> {
    return this.http.post<Person>(this.baseApiUrl + 'Person/', person)
  }

  updatePerson(person: Person): Observable<Person> {
    return this.http.put<Person>(this.baseApiUrl + 'Person/', person)
  }

  deletePerson(id: number): Observable<Person> {
    return this.http.delete<Person>(this.baseApiUrl + 'Person/' + id)
  }

}
