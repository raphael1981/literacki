import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventElement } from '../models/event-element';
import { API_URL } from '../config';
import { SearchParams } from '../models/search-params';
import { IndexResponse } from '../models/index-response';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) { }

  getEvents(searchParams: SearchParams): Observable<IndexResponse> {
    return this.httpClient.get<IndexResponse>(API_URL + '/api/search/index?regions=' + searchParams.regions + '&cities=' + searchParams.cities + '&attractions=' + searchParams.attractions + '&themes=' + searchParams.themes + '&ages=' + searchParams.ages + '&catalog=' + searchParams.catalog + '&page=' + searchParams.page + '&type=' + searchParams.type + "&status=" + searchParams.status + '&days=' + searchParams.days + '&order=' + searchParams.order)
  }
}
