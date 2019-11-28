import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceView'
})
export class PricePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    var priceString = ""
    var data = String(value)
    var p = data.split('.')
    if (p.length > 1) {
      if (parseInt(p[1]) > 9) {
        priceString += p[0] + '.' + p[1]
      } else {
        priceString += p[0] + '.' + p[1] + '0'
      }
    } else {
      priceString += p[0] + '.00'
    }
    return priceString;
    // return '<span class="price-data">' + priceString + '</span>&nbsp;<span class="price-suffix">zł/os</span>';
  }

}
