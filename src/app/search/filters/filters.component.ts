import { Component, OnInit, Input, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core';
import { Criteria } from 'src/app/models/criteria';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Region } from 'src/app/models/region';
import slug from 'slug';
import { City } from 'src/app/models/city';
import { Attraction } from 'src/app/models/attraction';
import { Theme } from 'src/app/models/theme';
import { Age } from 'src/app/models/age';
import { SearchParams } from 'src/app/models/search-params';
import { Catalog } from 'src/app/models/catalog';
import { EVENT_TYPES, DAYS, DaysInterval, EventType, Ordering, ORDERING } from 'src/app/config';
import { Day } from 'src/app/models/day';


@Component({
  selector: 'filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.less']
})
export class FiltersComponent implements OnInit, AfterContentInit, OnChanges {

  @Input() isCatalogSearch: boolean;
  @Input() isTypeSearch: boolean;
  @Input() viewCatalog: Catalog;

  @Input() currentCatalog: Catalog = {
    id: '',
    name: 'wszystkie katalogi',
    alias: 'wszystkie',
    current: false
  };
  @Input() currentEventType: EventType = {
    name: 'wszystkie typy',
    value: 'all'
  }
  // @Input() currentDayInterval: DaysInterval = {
  //   name: 'dowolna',
  //   value: 'all'
  // }
  @Input() currentOrdering: Ordering = {
    name: 'brak',
    value: 'default'
  }
  @Input() criteria: Criteria;
  @Input() searchParams: SearchParams;

  eventTypes: EventType[] = EVENT_TYPES;
  days: DaysInterval[] = DAYS;
  orderings: Ordering[] = ORDERING;

  catalogs: Catalog[] = []

  searchForm: FormGroup;
  regions: Region[]
  selectedRegions: Region[] = [];

  cities: City[] = [];
  relatedCities: City[] = [];
  selectedCities: City[] = [];

  attractions: Attraction[] = [];
  relatedAttractions: Attraction[] = [];
  selectedAttractions: Attraction[] = [];

  themes: Theme[] = []
  selectedThemes: Theme[] = []

  ages: Age[] = []
  selectedAges: Age[] = []

  daysList: Day[] = []
  selectedDays: Day[] = []

  page: number | string = 1;

  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    this.searchForm = this.createForm();

  }

  ngOnInit() {
    // console.log(this.catalogs, this.currentCatalog)
    // console.log(this.criteria)

    this.subscribeToRegion()
    this.subscribeToCity()
    this.subscribeToAttractions()
    this.subscribeToTheme()
    this.subscribeToAges()
    this.subscribeToCatalog()
    this.subscribeToEventType()
    this.subscribeToOrdering()
    this.activatedRoute.queryParams.subscribe(p => {
      if (p.page) {
        this.page = p.page
      } else {
        this.page = 1;
      }
    })
  }

  createForm(): FormGroup {
    return this.fb.group({
      catalog: [(this.currentCatalog) ? this.currentCatalog.id : this.catalogs[0].id],
      type: [(this.currentEventType) ? this.currentEventType.value : this.eventTypes[0].value],
      // daysIn: [(this.currentDayInterval) ? this.currentDayInterval.value : this.days[0].value],
      ordering: [(this.currentOrdering) ? this.currentOrdering.value : this.orderings[0].value],
      region: [''],
      city: [''],
      attraction: [''],
      theme: [''],
      age: [''],
      day: ['']
    })
  }

  ngAfterContentInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {


    if (changes.criteria) {
      if (changes.criteria.firstChange) {
        this.regions = this.criteria.regions;
        this.cities = this.criteria.cities;
        this.attractions = this.criteria.attractions;
        this.themes = this.criteria.themes
        this.ages = this.criteria.ages
        this.catalogs = this.criteria.catalogs;
        this.daysList = this.criteria.days;
        this.catalogs.unshift({
          id: '',
          name: 'wszystkie katalogi',
          alias: 'wszystkie',
          current: false
        })
      }
    }

    if (changes.searchParams) {
      if (changes.searchParams.firstChange) {
        this.addCriteriaFromParams()
      }
    }

    if (changes.currentCatalog) {
      if (changes.currentCatalog.firstChange) {
        if (changes.currentCatalog.currentValue) {
          this.searchForm.get('catalog').setValue(changes.currentCatalog.currentValue.id, { onlySelf: true })
        }
      }
    }

    if (changes.currentEventType) {
      if (changes.currentEventType.firstChange) {
        if (changes.currentEventType.currentValue) {
          this.searchForm.get('type').setValue(changes.currentEventType.currentValue.value, { onlySelf: true })
        }
      }
    }

    // if (changes.currentDayInterval) {
    //   if (changes.currentDayInterval.firstChange) {
    //     if (changes.currentDayInterval.currentValue) {
    //       this.searchForm.get('daysIn').setValue(changes.currentDayInterval.currentValue.value, { onlySelf: true })
    //     }
    //   }
    // }

    if (changes.currentOrdering) {
      if (changes.currentOrdering.firstChange) {
        if (changes.currentOrdering.currentValue) {
          this.searchForm.get('ordering').setValue(changes.currentOrdering.currentValue.value, { onlySelf: true })
        }
      }
    }

  }



  addCriteriaFromParams() {
    this.addRegionsFromParamsFilter()
    this.addCitiesFromParamsFilter()
    this.addAttractionsFromParamsFilter()
    this.addThemesFromParamsFilter()
    this.addAgesFromParamsFilter()
    this.addDaysFromParamsFilter()
  }

  resetFilters() {
    this.regions = this.criteria.regions;
    this.cities = this.criteria.cities;
    this.attractions = this.criteria.attractions;
    this.themes = this.criteria.themes;
    this.ages = this.criteria.ages;
    this.selectedRegions = [];
    this.selectedCities = [];
    this.selectedAttractions = []
    this.selectedThemes = [];
    this.selectedAges = [];
    this.changeSearchParams()
  }

  changeSearchParams() {

    this.router.navigate(['/'], {
      queryParams: {
        regions: this.makeRegionsStringParamValue(),
        cities: this.makeCitiesStringParamValue(),
        attractions: this.makeAttractionsStringParamValue(),
        themes: this.makeThemesStringParamValue(),
        ages: this.makeAgesStringParamValue(),
        days: this.makeDaysStringParamValue(),
        status: this.searchParams.status,
        type: this.searchForm.get('type').value,
        // days: this.searchForm.get('daysIn').value,
        order: this.searchForm.get('ordering').value,
        catalog: this.searchForm.get('catalog').value,
        page: 1
      }
    });
  }

  addRegionsFromParamsFilter() {
    var ids: string[] = this.searchParams.regions.split(':')
    ids.forEach((id, i) => {
      this.criteria.regions.map(r => {
        if (r.id == parseInt(id)) {
          this.selectedRegions.push(r)
        }
      })
    })
    this.regions = []
    this.criteria.regions.map(r => {
      var bool = true;
      this.selectedRegions.map(sr => {
        if (r.id == sr.id) {
          bool = false
        }
      })
      if (bool) {
        this.regions.push(r)
      }
    })
  }

  addCitiesFromParamsFilter() {
    var ids: string[] = this.searchParams.cities.split(':')
    ids.forEach((id, i) => {
      this.criteria.cities.map(r => {
        if (r.id == parseInt(id)) {
          this.selectedCities.push(r)
        }
      })
    })
    this.cities = []
    this.criteria.cities.map(r => {
      var bool = true;
      this.selectedCities.map(sr => {
        if (r.id == sr.id) {
          bool = false
        }
      })
      if (bool) {
        this.cities.push(r)
      }
    })
  }

  addAttractionsFromParamsFilter() {
    var ids: string[] = this.searchParams.attractions.split(':')
    ids.forEach((id, i) => {
      this.criteria.attractions.map(r => {
        if (r.id == parseInt(id)) {
          this.selectedAttractions.push(r)
        }
      })
    })
    this.attractions = []
    this.criteria.attractions.map(r => {
      var bool = true;
      this.selectedAttractions.map(sr => {
        if (r.id == sr.id) {
          bool = false
        }
      })
      if (bool) {
        this.attractions.push(r)
      }
    })
  }

  addThemesFromParamsFilter() {
    var ids: string[] = this.searchParams.themes.split(':')
    ids.forEach((id, i) => {
      this.criteria.themes.map(r => {
        if (r.id == parseInt(id)) {
          this.selectedThemes.push(r)
        }
      })
    })
    this.themes = []
    this.criteria.themes.map(r => {
      var bool = true;
      this.selectedThemes.map(sr => {
        if (r.id == sr.id) {
          bool = false
        }
      })
      if (bool) {
        this.themes.push(r)
      }
    })
  }

  addAgesFromParamsFilter() {
    var ids: string[] = this.searchParams.ages.split(':')
    ids.forEach((id, i) => {
      this.criteria.ages.map(r => {
        if (r.id == parseInt(id)) {
          this.selectedAges.push(r)
        }
      })
    })
    this.ages = []
    this.criteria.ages.map(r => {
      var bool = true;
      this.selectedAges.map(sr => {
        if (r.id == sr.id) {
          bool = false
        }
      })
      if (bool) {
        this.ages.push(r)
      }
    })
  }

  addDaysFromParamsFilter() {
    var ids: string[] = this.searchParams.days.split(':')
    ids.forEach((id, i) => {
      this.criteria.days.map(r => {
        if (r.id == parseInt(id)) {
          this.selectedDays.push(r)
        }
      })
    })
    this.daysList = []
    this.criteria.days.map(r => {
      var bool = true;
      this.selectedDays.map(sr => {
        if (r.id == sr.id) {
          bool = false
        }
      })
      if (bool) {
        this.daysList.push(r)
      }
    })
  }


  subscribeToRegion() {
    this.searchForm.get('region')
      .valueChanges
      .pipe(
        // debounceTime(100),
        // distinctUntilChanged()
      )
      .subscribe(d => {

        this.filterRegions(d)

      })
  }

  filterRegions(d: string) {
    this.regions = this.criteria.regions.filter(r => {
      var strLength = d.length;
      var rPart = r.name.substr(0, strLength)

      var bool = true;

      this.selectedRegions.map(sr => {
        if (sr.id == r.id) {
          bool = false;
        }
      })
      return slug(rPart.toLocaleLowerCase(), '-') == slug(d.toLocaleLowerCase(), '-') && bool
    })
  }

  subscribeToCity() {
    this.searchForm.get('city')
      .valueChanges
      .pipe(
        // debounceTime(100),
        // distinctUntilChanged()
      )
      .subscribe(d => {

        this.filterCities(d)

      })
  }

  filterCities(d: string) {
    this.cities = this.criteria.cities.filter(c => {
      var strLength = d.length;
      var rPart = c.name.substr(0, strLength)

      var bool = true;

      this.selectedCities.map(sc => {
        if (sc.id == c.id) {
          bool = false;
        }
      })
      return slug(rPart.toLocaleLowerCase(), '-') == slug(d.toLocaleLowerCase(), '-') && bool
    })
  }


  subscribeToAttractions() {
    this.searchForm.get('attraction')
      .valueChanges
      .pipe(
        // debounceTime(100),
        // distinctUntilChanged()
      )
      .subscribe(d => {

        this.filterAttractions(d)

      })
  }

  filterAttractions(d: string) {
    this.attractions = this.criteria.attractions.filter(a => {
      var strLength = d.length;
      var rPart = a.name.substr(0, strLength)

      var bool = true;

      this.selectedAttractions.map(sa => {
        if (sa.id == a.id) {
          bool = false;
        }
      })
      return slug(rPart.toLocaleLowerCase(), '-') == slug(d.toLocaleLowerCase(), '-') && bool
    })
  }

  subscribeToTheme() {
    this.searchForm.get('day')
      .valueChanges
      .pipe(
        // debounceTime(100),
        // distinctUntilChanged()
      )
      .subscribe(d => {

        // this.filterAge(d)

      })
  }

  subscribeToAges() {
    this.searchForm.get('theme')
      .valueChanges
      .pipe(
        // debounceTime(100),
        // distinctUntilChanged()
      )
      .subscribe(d => {

        this.filterTheme(d)

      })
  }

  subscribeToCatalog() {

    this.searchForm.get('catalog')
      .valueChanges
      .subscribe(d => {

        this.changeSearchParams()

      })


  }

  subscribeToEventType() {

    this.searchForm.get('type')
      .valueChanges
      .subscribe(d => {

        this.changeSearchParams()

      })


  }


  // subscribeToDays() {

  //   this.searchForm.get('daysIn')
  //     .valueChanges
  //     .subscribe(d => {

  //       this.changeSearchParams()

  //     })


  // }



  subscribeToOrdering() {

    this.searchForm.get('ordering')
      .valueChanges
      .subscribe(d => {

        this.changeSearchParams()

      })


  }


  filterTheme(d: string) {
    // console.log(cities)
    this.themes = this.criteria.themes.filter(a => {
      var strLength = d.length;
      var rPart = a.name.substr(0, strLength)

      var bool = true;

      this.themes.map(sa => {
        if (sa.id == a.id) {
          bool = false;
        }
      })
      return slug(rPart.toLocaleLowerCase(), '-') == slug(d.toLocaleLowerCase(), '-') && bool
    })

  }




  addRegion(region: Region) {
    var bool = true;
    this.selectedRegions.map(r => {
      if (region.id == r.id) {
        bool = false;
      }
    })
    if (bool) {
      this.selectedRegions.push(region);
      this.regions = this.regions.filter(r => {
        return r.id != region.id
      })
      this.changeSearchParams()
      // this.filterAddCity(region.cities)
    }
  }

  addCity(city: City) {
    var bool = true;
    this.selectedCities.map(c => {
      if (city.id == c.id) {
        bool = false;
      }
    })
    if (bool) {
      this.selectedCities.push(city)
      // this.relatedCities = this.relatedCities.filter(c => {
      //   return c.id != city.id
      // })
      this.cities = this.cities.filter(c => {
        return c.id != city.id
      })
      this.changeSearchParams()
      // this.filterAddCity(region.cities)
      // this.createAttractionsList()
    }
  }

  addAttraction(attr: Attraction) {
    var bool = true;
    this.selectedAttractions.map(a => {
      if (attr.id == a.id)
        bool = false;
    })
    if (bool) {
      this.selectedAttractions.push(attr)
      this.attractions = this.attractions.filter(a => {
        return a.id != attr.id
      })
      this.changeSearchParams()
      // this.relatedAttractions = this.relatedAttractions.filter(a => {
      //   return a.id != attr.id
      // })
    }
  }


  addTheme(thm: Theme) {
    var bool = true;
    this.selectedThemes.map(a => {
      if (thm.id == a.id)
        bool = false;
    })
    if (bool) {
      this.selectedThemes.push(thm)
      this.themes = this.themes.filter(a => {
        return a.id != thm.id
      })
      this.changeSearchParams()
    }
  }

  addAge(ag: Age) {
    var bool = true;
    this.selectedAges.map(a => {
      if (ag.id == a.id)
        bool = false;
    })
    if (bool) {
      this.selectedAges.push(ag)
      this.ages = this.ages.filter(a => {
        return a.id != ag.id
      })
      this.changeSearchParams()
    }
  }

  addDay(ag: Day) {
    var bool = true;
    this.selectedDays.map(a => {
      if (ag.id == a.id)
        bool = false;
    })
    if (bool) {
      this.selectedDays.push(ag)
      this.daysList = this.daysList.filter(a => {
        return a.id != ag.id
      })
      this.changeSearchParams()
    }
  }

  removeRegion(sr: Region, i: number) {
    this.selectedRegions.splice(i, 1)
    // this.refactorCitesAfterRemoveRegion()
    this.regions.unshift(sr)
    // this.createAttractionsList()
    this.changeSearchParams()
  }

  removeCity(city: City, i: number) {
    this.selectedCities.splice(i, 1)
    // this.refactorCitesAfterRemoveRegion()
    this.cities.unshift(city)
    this.changeSearchParams()
  }

  removeAttraction(attr: Attraction, i: number) {
    this.selectedAttractions.splice(i, 1)
    // this.createAttractionsList()
    this.attractions.unshift(attr)
    this.changeSearchParams()
  }

  removeTheme(th: Theme, i: number) {
    this.selectedThemes.splice(i, 1)
    this.themes.unshift(th)
    this.changeSearchParams()
  }

  removeAge(ag: Age, i: number) {
    this.selectedAges.splice(i, 1)
    this.ages.unshift(ag)
    this.changeSearchParams()
  }

  removeDay(ag: Day, i: number) {
    this.selectedDays.splice(i, 1)
    this.daysList.unshift(ag)
    this.changeSearchParams()
  }


  makeRegionsStringParamValue(): string {

    var value = ''

    this.selectedRegions.forEach((r, i) => {
      if (i != (this.selectedRegions.length - 1)) {
        value += r.id + ':'
      } else {
        value += r.id;
      }
    })

    return value;

  }

  makeCitiesStringParamValue(): string {
    var value = ''

    this.selectedCities.forEach((r, i) => {
      if (i != (this.selectedCities.length - 1)) {
        value += r.id + ':'
      } else {
        value += r.id;
      }
    })

    return value;
  }

  makeAttractionsStringParamValue(): string {
    var value = ''

    this.selectedAttractions.forEach((r, i) => {
      if (i != (this.selectedAttractions.length - 1)) {
        value += r.id + ':'
      } else {
        value += r.id;
      }
    })

    return value;
  }

  makeThemesStringParamValue(): string {
    var value = ''

    this.selectedThemes.forEach((r, i) => {
      if (i != (this.selectedThemes.length - 1)) {
        value += r.id + ':'
      } else {
        value += r.id;
      }
    })

    return value;
  }

  makeAgesStringParamValue(): string {
    var value = ''

    this.selectedAges.forEach((r, i) => {
      if (i != (this.selectedAges.length - 1)) {
        value += r.id + ':'
      } else {
        value += r.id;
      }
    })

    return value;
  }


  makeDaysStringParamValue(): string {
    var value = ''

    this.selectedDays.forEach((r, i) => {
      if (i != (this.selectedDays.length - 1)) {
        value += r.id + ':'
      } else {
        value += r.id;
      }
    })

    return value;
  }


  //////////////////////////////////////////////////////////////////////////////

  filterAddCity(cities: City[]) {
    // console.log(cities)
    cities.map(rc => {

      var bool = true;

      this.cities.map(c => {
        bool = rc.id != c.id
      })

      if (bool) {
        this.relatedCities.push(rc)
      }

    })

  }


  refactorCitesAfterRemoveRegion() {
    this.relatedCities = []
    this.selectedRegions.map((r) => {
      var cs: City[] = r.cities;
      cs.forEach(c => {
        var bool = true;
        this.selectedCities.map(sc => {
          if (sc.id == c.id)
            bool = false;
        })
        if (bool)
          this.relatedCities.push(c)
      })
    }
    )
  }


  createAttractionsList() {

    // this.selectedAttractions = []

    this.selectedRegions.map((r) => {

      var cities: City[] = r.cities;

      cities.map(c => {


        c.attractions.map(a => {
          var bool = true;
          this.relatedAttractions.map(sa => {
            if (sa.id == a.id)
              bool = false
          })

          if (bool)
            this.relatedAttractions.push(a)

        })

      })

    })
  }




}
