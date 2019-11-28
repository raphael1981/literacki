import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { NavPage } from './model/nav-page';
import { count } from 'rxjs/operators';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.less']
})
export class PaginationComponent implements OnInit, OnChanges {

  pages: number = 10;
  @Input() current: number;
  @Input() total: number;
  @Output() emitChange: EventEmitter<any> = new EventEmitter<any>()
  pagination: NavPage[];

  constructor() { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.total) {
      this.createPaginationViewData();
    }
    if (changes.current) {
      if (!changes.current.firstChange) {
        this.createPaginationViewData();
      }
    }
  }


  createPaginationViewData() {

    if (this.total > 0) {
      this.pages = Math.ceil(this.total / 20);
    }

    this.preparePags()

  }


  preparePags() {

    var pgs = [];

    for (var i = 0; i < this.pages; i++) {

      var act = false;
      if ((i + 1) == this.current) {
        act = true;
      }

      pgs.push({
        nr: (i + 1),
        active: act
      })
    }

    this.pagination = pgs;
  }


  changePag(event, p: NavPage) {
    event.preventDefault()
    this.emitChange.emit(p);
  }

}
