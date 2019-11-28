import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Catalog } from '../models/catalog';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {

  constructor(private httpClient: HttpClient) { }

  getCatalog(id: number | string): Observable<Catalog> {
    return this.httpClient.get<Catalog>(API_URL + '/api/get/catalog/' + id)
  }

}
