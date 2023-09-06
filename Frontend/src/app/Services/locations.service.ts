import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Location } from '../Models/Location';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;

  getLocations(): Observable<Location[]>{
    return this.http.get<Location[]>(this.baseApiUrl + 'Location/')
  }

  getLocationById(id: number): Observable<Location>{
    return this.http.get<Location>(this.baseApiUrl + 'Location/' + id)
  }

  getLocationByName(name: string): Observable<Location>{
    return this.http.get<Location>(this.baseApiUrl + 'Location/' + name)
  }

  addLocation(location: Location): Observable<Location>{
    return this.http.post<Location>(this.baseApiUrl + 'Location/', location)
  }

  updateLocation(location: Location): Observable<Location>{
    return this.http.put<Location>(this.baseApiUrl + 'Location/', location)
  }

  deleteLocation(id: number): Observable<Location>{
    return this.http.delete<Location>(this.baseApiUrl + 'Location/' + id)
  }
}
