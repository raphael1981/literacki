import { Component, OnInit, ComponentFactoryResolver, Type, ComponentRef, ViewChild, ViewContainerRef, } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Criteria } from '../models/criteria';
import { EventService } from '../services/event.service';
import { SearchParams } from '../models/search-params';
import { IndexResponse } from '../models/index-response';
import { PricePopupComponent } from './price-popup/price-popup.component';
import { EventElement } from '../models/event-element';
import { Catalog } from '../models/catalog';
import { EVENT_TYPES, DaysInterval, DAYS, EventType, Ordering, ORDERING } from '../config';
import { CatalogToViewService } from '../services/catalog-to-view.service';
import { CatalogService } from '../services/catalog.service';
import { TypeToViewService } from '../services/type-to-view.service';



@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {

  viewCatalog: Catalog
  isCatalogSearch: boolean = true;
  isTypeSearch: boolean = true;
  menu: string[];

  currentCatalog: Catalog;
  currentEventType: EventType;
  // currentDayInterval: DaysInterval;
  currentOrdering: Ordering;
  eventTypes: EventType[] = EVENT_TYPES;
  days: DaysInterval[] = DAYS;
  orderings: Ordering[] = ORDERING;
  criteria: Criteria;
  indexResponse: IndexResponse;
  isFirstLoad: boolean = true;
  searchParams: SearchParams;
  @ViewChild('popUp', { read: ViewContainerRef }) popupTemp: ViewContainerRef
  pricePopup: ComponentRef<PricePopupComponent>

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventService: EventService,
    private router: Router, private resolveFactory: ComponentFactoryResolver,
    private catalogToView: CatalogToViewService,
    private typeToViewService: TypeToViewService,
    private catalogService: CatalogService) {
    this.menu = activatedRoute.snapshot.data['menu']
    this.criteria = activatedRoute.snapshot.data['criteria']
    this.indexResponse = activatedRoute.snapshot.data['events']
  }


  ngOnInit() {
    // console.log(this.indexResponse)

    this.subscribeToCatalog()
    this.subscribeToType()

    this.activatedRoute.queryParams.subscribe(p => {

      this.searchParams = {
        regions: p['regions'] ? p['regions'] : '',
        cities: p['cities'] ? p['cities'] : '',
        attractions: p['attractions'] ? p['attractions'] : '',
        themes: p['themes'] ? p['themes'] : '',
        ages: p['ages'] ? p['ages'] : '',
        catalog: p['catalog'] ? p['catalog'] : '',
        status: p['status'] ? p['status'] : 'all',
        type: p['type'] ? p['type'] : 'all',
        days: p['days'] ? p['days'] : '',
        order: p['order'] ? p['order'] : 'default',
        page: p['page'] ? p['page'] : 1
      }

      if (p['catalog']) {
        this.currentCatalog = this.findCurrentCatalog(p['catalog'])
      }

      if (p['type']) {
        this.currentEventType = this.findCurrentEventType(p['type'])
      }

      // if (p['days']) {
      //   this.currentDayInterval = this.findCurrentDayInteval(p['days'])
      // }

      if (p['order']) {
        this.currentOrdering = this.findCurrentOrder(p['order'])
      }

      if (!this.isFirstLoad) {
        this.eventService.getEvents(this.searchParams).subscribe(d => {
          this.indexResponse = d
          // console.log(this.indexResponse.hits)
        })
      }

      if (this.isFirstLoad) {
        this.isFirstLoad = false;
      }


    })
  }

  subscribeToCatalog() {
    this.catalogToView.subject$.subscribe(c => {
      if (c) {
        this.viewCatalog = c;
      }
    })
    this.catalogToView.subjectId$.subscribe(bool => {
      if (bool) {
        this.isCatalogSearch = false;
      }
    })
  }

  subscribeToType() {
    this.typeToViewService.subject$.subscribe(type => {
      if (type) {
        this.isTypeSearch = false;
      }
    })
  }

  findCurrentCatalog(id: number | string) {
    var catalog: Catalog = {
      id: '',
      name: 'wszystkie',
      alias: 'wszystkie',
      current: false
    };
    this.criteria.catalogs.map(c => {
      if (c.id == id) {
        catalog = c;
      }
    })
    return catalog;
  }

  findCurrentEventType(value: string) {
    var et: EventType = this.eventTypes[0];
    this.eventTypes.map(etype => {
      if (etype.value == value) {
        et = etype;
      }
    })
    return et;
  }

  findCurrentOrder(value: string) {
    var or: Ordering = this.orderings[0];
    this.orderings.map(d => {
      if (d.value == value) {
        or = d;
      }
    })
    return or;
  }


  findCurrentDayInteval(value: string) {
    var di: DaysInterval = this.days[0];
    this.days.map(d => {
      if (d.value == value) {
        di = d;
      }
    })
    return di;
  }


  changePag($event) {
    this.searchParams.page = $event.nr;
    this.router.navigate(['/'], { queryParams: this.searchParams })
  }

  openPricePopup($event: EventElement) {
    this.popupTemp.clear()
    let ppu = this.resolveFactory.resolveComponentFactory(<Type<PricePopupComponent>>PricePopupComponent)
    this.pricePopup = <ComponentRef<PricePopupComponent>>this.popupTemp.createComponent(ppu)
    this.pricePopup.instance.eventElement = $event;
    this.pricePopup.instance.emitClose.subscribe(r => {
      this.pricePopup.destroy()
    })

  }

}
