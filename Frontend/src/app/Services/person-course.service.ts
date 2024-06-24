import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PersonCourse } from '../Models/PersonCourse';

@Injectable({
  providedIn: 'root'
})
export class PersonCourseService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;

  getAllPersonCourses(): Observable<PersonCourse[]>{
    return this.http.get<PersonCourse[]>(this.baseApiUrl + 'PersonCourses');
  }

  getPersonCoursesByPerson(personId: number): Observable<PersonCourse[]>{
    return this.http.get<PersonCourse[]>(this.baseApiUrl + 'PersonCourses/person/' + personId);
  }

  getPersonCoursesByCourse(courseId: number): Observable<PersonCourse[]>{
    return this.http.get<PersonCourse[]>(this.baseApiUrl + 'PersonCourses/course/' + courseId);
  }

  getCourseStatusCount(moduleId: number): Observable<any[]> {
    return this.http.get<any[]>(this.baseApiUrl + 'PersonCourses/module/' + moduleId);
  }

  addPersonCourse(personCourse: PersonCourse): Observable<PersonCourse>{
    return this.http.post<PersonCourse>(this.baseApiUrl + 'PersonCourses/', personCourse);
  }

  updatePersonCourse(personCourse: PersonCourse): Observable<PersonCourse>{
    return this.http.put<PersonCourse>(this.baseApiUrl + 'PersonCourses/', personCourse);
  }

  deletePersonCourse(personId: number, courseId: number): Observable<boolean>{
    return this.http.delete<boolean>(this.baseApiUrl + 'PersonCourses/person/' + personId + '/course/' + courseId);
  }

}
