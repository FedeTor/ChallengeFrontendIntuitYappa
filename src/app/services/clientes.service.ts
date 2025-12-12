import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente, ClienteCreateDto, ClienteUpdateDto } from '../models/cliente.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ClientesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/api/clientes`;

  getAll(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.baseUrl);
  }

  getById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.baseUrl}/${id}`);
  }

  search(term: string): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.baseUrl}/search`, {
      params: { term }
    });
  }

  create(data: ClienteCreateDto): Observable<HttpResponse<Cliente>> {
    return this.http.post<Cliente>(this.baseUrl, data, { observe: 'response' });
  }

  update(id: number, data: ClienteUpdateDto): Observable<HttpResponse<Cliente>> {
    return this.http.put<Cliente>(`${this.baseUrl}/${id}`, data, { observe: 'response' });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
