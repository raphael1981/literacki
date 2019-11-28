import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeToViewService {

  subject$: BehaviorSubject<null | string> = new BehaviorSubject(null)

  constructor() { }

  typePut(t: string) {

    this.subject$.next(t)
  }

}
