import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventElement } from 'src/app/models/event-element';
import { API_URL } from 'src/app/config';
import * as moment from 'moment'

@Component({
  selector: 'event-row',
  templateUrl: './event-row.component.html',
  styleUrls: ['./event-row.component.less']
})
export class EventRowComponent implements OnInit {

  apiUrl: string = API_URL;
  @Output() emitOpenPrice: EventEmitter<EventElement> = new EventEmitter()
  @Input() eventElement: EventElement;
  isDateAvl: boolean = true;

  constructor() { }

  ngOnInit() {
    // console.log(this.eventElement)
    this.isDateAvlCheck()
  }

  isDateAvlCheck() {
    if (this.eventElement.eventType == 'organize') {
      var now = moment(new Date()).add(1, 'day')
      var st = moment(this.eventElement.startAt)
      this.isDateAvl = !now.isAfter(st)
    }
  }

  openPrice() {
    this.emitOpenPrice.emit(this.eventElement)
  }

}
