import { City } from './city';
import { Attraction } from './attraction';

export interface Region {
    id: number;
    name: string;
    cities?: City[];
    attractions?: Attraction[];
}