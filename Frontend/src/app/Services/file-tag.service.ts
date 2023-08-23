import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FileTag } from '../Models/FileTag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileTagService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;

  getFileTag(): Observable<FileTag[]>{
    return this.http.get<FileTag[]>(this.baseApiUrl + 'FileTag')
  }  

  getFileTagById(id: number): Observable<FileTag>{
    return this.http.get<FileTag>(this.baseApiUrl + 'FileTag/' + id)
  }

  getFileTagByName(name: string): Observable<FileTag>{
    return this.http.get<FileTag>(this.baseApiUrl + 'FileTag/' + name)
  }

  createFileTag(fileTag: FileTag): Observable<FileTag>{
    return this.http.post<FileTag>(this.baseApiUrl + 'FileTag/', fileTag)
  }

  updateFileTag(fileTag: FileTag): Observable<FileTag>{
    return this.http.put<FileTag>(this.baseApiUrl + 'FileTag/', fileTag)
  }

  deleteFiletag(id: number): Observable<FileTag>{
    return this.http.delete<FileTag>(this.baseApiUrl + 'FileTag/' + id)
  }
}
