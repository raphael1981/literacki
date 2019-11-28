import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment'

@Pipe({
  name: 'dateBetween'
})
export class DateBetweenPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    var sAt = moment(value)
    var eAt = moment(args)
    if (sAt.toDate().getFullYear() == eAt.toDate().getFullYear()) {
      return sAt.format('D.MM') + ' - ' + eAt.format('D.MM.YYYY')
    } else {
      return sAt.format('D.MM.YYYY') + ' - ' + eAt.format('D.MM.YYYY')
    }
  }

}
