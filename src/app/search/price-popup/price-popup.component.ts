import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EventElement } from 'src/app/models/event-element';

@Component({
  selector: 'app-price-popup',
  templateUrl: './price-popup.component.html',
  styleUrls: ['./price-popup.component.less']
})
export class PricePopupComponent implements OnInit {

  @Input() eventElement: EventElement;
  @Output() emitClose: EventEmitter<boolean> = new EventEmitter()

  constructor() { }

  ngOnInit() {
  }

  closePopUp() {
    this.emitClose.emit(true)
  }

}
