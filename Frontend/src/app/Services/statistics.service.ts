import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;

  getPersonsPerDepartmentFromModule(moduleId: number): Observable<any[]> {
    return this.http.get<any[]>(this.baseApiUrl + 'Statistics/personsperdepartment/module/' + moduleId);
  }

  getPersonsPerDepartment(): Observable<any[]> {
    return this.http.get<any[]>(this.baseApiUrl + 'Statistics/personsperdepartment/');
  }

  getPersonsPerLocation(): Observable<any[]> {
    return this.http.get<any[]>(this.baseApiUrl + 'Statistics/personsperlocation/');
  }

  getCourseStatusCount(moduleId: number): Observable<any[]> {
    return this.http.get<any[]>(this.baseApiUrl + 'Statistics/coursestatuscount/module/' + moduleId);
  }

  getPersonsPerDepartmentAndLocation(): Observable<any> {
    return this.http.get<any>(this.baseApiUrl + 'Statistics/personsperdepartmentandlocation/');
  }
}
