import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CatalogService } from './catalog.service';
import { Catalog } from '../models/catalog';

@Injectable({
  providedIn: 'root'
})
export class CatalogToViewService {

  subject$: BehaviorSubject<null | Catalog> = new BehaviorSubject(null)
  subjectId$: BehaviorSubject<boolean> = new BehaviorSubject(false)

  constructor(private catalogService: CatalogService) { }

  catalogPut(catalogId: number) {
    this.catalogService.getCatalog(catalogId).subscribe(c => {
      this.subject$.next(c)
    })
  }

  catalogIdPut() {
    this.subjectId$.next(true)
  }

}
