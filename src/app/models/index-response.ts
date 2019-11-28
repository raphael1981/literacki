import { EventElement } from './event-element';

export interface Hit {
    _id: string;
    _source: EventElement
}


//Freebds
// export interface Source {
//     hits: Hit[];
//     total: number;
// }

//Windows
export interface Source {
    hits: Hit[]
    total: { value: number, relation?: string }
}


export interface IndexResponse {
    hits: Source;
    timed_out: boolean;
}
