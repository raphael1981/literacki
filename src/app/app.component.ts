import { Component, ElementRef, OnInit } from '@angular/core';
import { CatalogToViewService } from './services/catalog-to-view.service';
import { Meta, Title } from '@angular/platform-browser';
import { TypeToViewService } from './services/type-to-view.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  viewType: string | null;
  catalog: string | null;
  eventType: string | null;

  constructor(elm: ElementRef, private catalogToView: CatalogToViewService, private title: Title, private meta: Meta, private typeToViewService: TypeToViewService) {
    this.viewType = elm.nativeElement.getAttribute('viewType')
    this.catalog = elm.nativeElement.getAttribute('catalogId')
    this.eventType = elm.nativeElement.getAttribute('type')
  }

  ngOnInit(): void {
    this.subscribeToCatalog()
    // this.catalogToView.catalogPut(1)
    // this.catalogToView.catalogIdPut()
    if (this.viewType == 'catalog' && (this.catalog != null || this.catalog != undefined)) {
      this.catalogToView.catalogIdPut()
      this.catalogToView.catalogPut(parseInt(this.catalog))
    }
    if (this.eventType) {
      this.typeToViewService.typePut(this.eventType)
    }
  }

  subscribeToCatalog() {
    this.catalogToView.subject$.subscribe(c => {
      if (c) {
        this.title.setTitle(c.name)
      }
    })
  }

}
