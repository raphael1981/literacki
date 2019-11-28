import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private httpClient: HttpClient) { }

  getMenu(): Promise<string[]> {
    return this.httpClient.get<string[]>(API_URL + '/api/get/cached/menu').toPromise()
  }

}
