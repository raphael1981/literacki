import { AppModule } from './app.module';
import {
    BrowserModule,
    BrowserTransferStateModule // <--- Added
} from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CriteriaService } from './services/criteria.service';
import { EventService } from './services/event.service';
import { CatalogToViewService } from './services/catalog-to-view.service';
import { CatalogService } from './services/catalog.service';
import { TypeToViewService } from './services/type-to-view.service';

@NgModule({
    declarations: [],
    imports: [
        BrowserModule.withServerTransition({
            appId: 'wirtur-id'
        }),
        BrowserTransferStateModule, // <--- Added
        AppModule
    ],
    providers: [CriteriaService, EventService, CatalogToViewService, CatalogService, TypeToViewService],
    bootstrap: [AppComponent]
})
export class BrowserAppModule { }
