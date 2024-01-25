import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Course } from '../Models/Course';
import { Person } from '../Models/Person';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;

  getAllCourses(): Observable<Course[]>{
    return this.http.get<Course[]>(this.baseApiUrl + 'Courses');
  }

  getCourse(courseId: number): Observable<Course>{
    return this.http.get<Course>(this.baseApiUrl + 'Courses/' + courseId)
  }
  
  addCourses(Course: Course): Observable<Course>{
    return this.http.post<Course>(this.baseApiUrl + 'Courses/', Course)
  }

  updateCourse(Course: Course): Observable<Course>{
    return this.http.put<Course>(this.baseApiUrl + 'Courses/', Course)
  }

  deleteCourse(courseId: number): Observable<Course>{
    return this.http.delete<Course>(this.baseApiUrl + 'Courses/' + courseId)
  }
}
