import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Book } from '../Models/Book';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  baseApiUrl: string = environment.baseApiUrl;
  extendedApiUrl: string = "Book/";


  getBook(): Observable<Book[]>{
    return this.http.get<Book[]>(this.baseApiUrl + this.extendedApiUrl)
  }

  getBookById(id: number): Observable<Book>{
    return this.http.get<Book>(this.baseApiUrl + this.extendedApiUrl + id)
  }

  addBook(book: Book): Observable<Book>{
    return this.http.post<Book>(this.baseApiUrl + this.extendedApiUrl, book)
  }

  updateBook(book: Book): Observable<Book>{
    return this.http.put<Book>(this.baseApiUrl + this.extendedApiUrl, book)
  }

  deleteBook(id: number): Observable<Book>{
    return this.http.delete<Book>(this.baseApiUrl + this.extendedApiUrl + id)
  }
}
