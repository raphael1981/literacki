import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { EventService } from './event.service';
import { EventElement } from '../models/event-element';
import { SearchParams } from '../models/search-params';
import { IndexResponse } from '../models/index-response';

@Injectable({
  providedIn: 'root'
})
export class EventsResolveService implements Resolve<IndexResponse> {

  constructor(private eventService: EventService) { }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IndexResponse> {
    let searchParams: SearchParams = {
      regions: route.queryParams['regions'] ? route.queryParams['regions'] : '',
      cities: route.queryParams['cities'] ? route.queryParams['cities'] : '',
      attractions: route.queryParams['attractions'] ? route.queryParams['attractions'] : '',
      themes: route.queryParams['themes'] ? route.queryParams['themes'] : '',
      ages: route.queryParams['ages'] ? route.queryParams['ages'] : '',
      catalog: route.queryParams['catalog'] ? route.queryParams['catalog'] : '',
      status: route.queryParams['status'] ? route.queryParams['status'] : 'avl',
      type: route.queryParams['type'] ? route.queryParams['type'] : 'all',
      days: route.queryParams['days'] ? route.queryParams['days'] : '',
      order: route.queryParams['order'] ? route.queryParams['order'] : 'default',
      page: route.queryParams['page'] ? route.queryParams['page'] : 1
    }
    return this.eventService.getEvents(searchParams)
  }

}
