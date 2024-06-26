import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { File } from '../Models/File';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;

  getFiles(roleId: number): Observable<File[]>{
    return this.http.get<File[]>(this.baseApiUrl + 'File/role/' + roleId)
  }

  getFilesById(id: number): Observable<File>{
    return this.http.get<File>(this.baseApiUrl + 'File/' + id)
  }

  getFilesByName(name: string): Observable<File[]>{
    return this.http.get<File[]>(this.baseApiUrl + 'File/' + name)
  }

  addFile(file: File): Observable<File>{
    return this.http.post<File>(this.baseApiUrl + 'File/', file)
  }

  downloadFile(id: number): Observable<any>
  {
    return this.http.get(this.baseApiUrl + `File/DownloadFile/` + id, { responseType: 'blob' })
  }

  uploadFile(formData: FormData, userId: number, tagId: number): Observable<any>
  {
    return this.http.post(this.baseApiUrl + `File/` + userId + `/` + tagId, formData, {
      headers: new HttpHeaders()
    })
  }

  uploadMultipleFiles(formData: FormData): Observable<File[]>
  {
    return this.http.post<File[]>(this.baseApiUrl + 'File/multiple', formData);
  }

  // Could be used? Dont see why :) 
  // Haven't tested for bug, or if it even works
  // updateFile(file: File): Observable<File>{
  //   return this.http.put<File>(this.baseApiUrl + 'File/', file)
  // }

  deleteFile(id: number): Observable<File>{
    console.log(id);
    
    return this.http.delete<File>(this.baseApiUrl + 'File/' + id)
  }

}
