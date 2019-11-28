import { Attraction } from './attraction';

export interface City {
    id: number;
    name: string;
    attractions?: Attraction[];
}