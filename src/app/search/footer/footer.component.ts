import { Component, OnInit } from '@angular/core';
import { API_URL } from 'src/app/config';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {

  apiUrl: string = API_URL;
  constructor() { }

  ngOnInit() {
  }

}
