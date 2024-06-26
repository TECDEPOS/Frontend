import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../Models/User';
import { userViewModel } from '../Models/ViewModels/addUserViewModel';
import { UserRole } from '../Models/UserRole';
import { BossViewModel, LeaderViewModel } from '../Models/ViewModels/BossViewModel';

const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;

  getUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.baseApiUrl + 'Users/')  
  }

  getEducationBossesExcel(): Observable<BossViewModel[]>{
    return this.http.get<BossViewModel[]>(this.baseApiUrl + 'Users/educationBossesExcel')  
  }

  getEducationLeadersExcel(): Observable<LeaderViewModel[]>{
    return this.http.get<LeaderViewModel[]>(this.baseApiUrl + 'Users/educationLeadersExcel')  
  }

  getUsersByEducationBossId(id: number): Observable<User[]>{
    return this.http.get<User[]>(this.baseApiUrl + 'Users/educationleader/' + id)  
  }

  getUsersByUserRole(userRole: UserRole): Observable<User[]>{
    return this.http.get<User[]>(this.baseApiUrl + 'Users/userrole?userRole=' + userRole)  
  }

  getUsersById(id: number): Observable<User>{
    return this.http.get<User>(this.baseApiUrl + 'Users/' + id)
  }

  getUsersByName(name: string): Observable<User>{
    return this.http.get<User>(this.baseApiUrl + 'Users/' + name)
  }

  // Ved ikke om den er skrevet rigtig -_-
  addUsers(user: userViewModel): Observable<userViewModel>{
    return this.http.post<userViewModel>(this.baseApiUrl + 'Users/', user)
  }

  updateUser(user: User): Observable<User>{
    return this.http.put<User>(this.baseApiUrl + 'Users', user, httpOptions)
  }

  deleteUser(id: number): Observable<User>{
    return this.http.delete<User>(this.baseApiUrl + 'Users/' + id)
  }
}
