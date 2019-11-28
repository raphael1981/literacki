import { Theme } from './theme';
import { Region } from './region';
import { Age } from './age';
import { City } from './city';
import { Attraction } from './attraction';
import { Catalog } from './catalog';
import { Day } from './day';

export interface Criteria {
    regions: Region[];
    cities: City[];
    attractions: Attraction[];
    themes: Theme[];
    ages: Age[];
    days: Day[];
    catalogs?: Catalog[];
}