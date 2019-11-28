import { DaysInterval } from '../config';

export interface SearchParams {
    regions: string;
    cities: string;
    attractions: string;
    themes: string;
    ages: string;
    catalog: string | number;
    status: string | 'avl' | 'noavl' | 'all';
    type: string | 'all' | 'templates' | 'winter' | 'summer'
    days: string;
    order?: string;
    page: string | number;
}