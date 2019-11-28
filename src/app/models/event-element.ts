import { Region } from './region';
import { City } from './city';
import { Attraction } from './attraction';
import { Theme } from './theme';
import { Age } from './age';
import { Day } from './day';

export interface PriceConfig {
    from: string | number;
    to: string | number;
    price: string | number;
}

export interface EventElement {
    eid: number;
    catalogId: number | null;
    catalogName: string | null;
    link: string;
    name: string;
    alais: string;
    number: string;
    image: string | null;
    startAt: Date;
    endAt: Date;
    eventType: string;
    eventSezonType: string;
    smallDesc: string | null;
    status: string;
    content: string;
    regions: Region[];
    cities: City[];
    attractions: Attraction[];
    themes: Theme[];
    days: Day[];
    ages: Age[];
    priceConfig?: PriceConfig[]
    priceBrutto?: number | null;
}