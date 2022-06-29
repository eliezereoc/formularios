import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Cep } from '../model/cep';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  constructor(private http: HttpClient) {}

  getCep(cep: string): Observable<Cep[]> {
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    return this.http.get<Cep>(url).pipe(
      map((cep) => cep),
      catchError((e) => this.errorHandler(e))
    );
  }

  errorHandler(e: any): Observable<any> {
    console.log(e);
    return EMPTY;
  }
}
