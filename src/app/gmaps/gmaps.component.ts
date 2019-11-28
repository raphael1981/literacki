import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Criteria } from '../models/criteria';

@Component({
  selector: 'app-gmaps',
  templateUrl: './gmaps.component.html',
  styleUrls: ['./gmaps.component.less']
})
export class GmapsComponent implements OnInit {

  menu: string;
  criteria: Criteria;
  viewCatalog: string = null
  lat = 52.069325;
  lng = 19.480297;

  constructor(private activatedRoute: ActivatedRoute) {
    this.menu = activatedRoute.snapshot.data['menu']
    this.criteria = activatedRoute.snapshot.data['criteria']
    console.log(this.criteria)
  }

  ngOnInit() {
  }

}
