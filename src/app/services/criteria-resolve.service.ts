import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Region } from '../models/region';
import { Theme } from '../models/theme';
import { Age } from '../models/age';
import { Observable } from 'rxjs';
import { CriteriaService } from './criteria.service';
import { API_URL } from 'ngadmin/src/app/config';
import { Criteria } from '../models/criteria';

@Injectable({
  providedIn: 'root'
})
export class CriteriaResolveService implements Resolve<Criteria> {

  constructor(private criteriaService: CriteriaService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Criteria> {
    return this.criteriaService.getCriteriaList()
  }
}
