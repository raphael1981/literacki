import { Component, OnInit, Input } from '@angular/core';
import { Catalog } from 'src/app/models/catalog';
import { API_URL } from 'src/app/config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  @Input() catalog: Catalog
  @Input() menu: string[]
  apiUrl: string = API_URL

  constructor() { }

  ngOnInit() {
    // console.log(this.menu)
  }

}
