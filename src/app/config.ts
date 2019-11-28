export const API_URL: string = 'http://localhost:3000'
// export const API_URL: string = 'http://wirtur.space4web.pl'

export interface EventType {
    name: string;
    value: string;
}

export const EVENT_TYPES: EventType[] = [
    {
        name: 'wszystkie typy',
        value: 'all'
    },
    {
        name: 'Wycieczki szkolne',
        value: 'template'
    },
    {
        name: 'Zimowiska',
        value: 'winter'
    },
    {
        name: 'Kolonie letnie',
        value: 'summer'
    }
]

export interface DaysInterval {
    name: string;
    value: string;
}

export const DAYS: DaysInterval[] = [
    {
        name: 'dowolna',
        value: 'all'
    },
    {
        name: '1-3',
        value: '1:3'
    },
    {
        name: '3-7',
        value: '3:7'
    },
    {
        name: '7-14',
        value: '7:14'
    },
    {
        name: '14 i więcej',
        value: '14'
    }
]

export interface Ordering {
    name: string;
    value: string;
}

export const ORDERING: Ordering[] = [
    {
        name: 'brak',
        value: 'default'
    },
    {
        name: 'data rozpoczęcia',
        value: 'startAt'
    },
    {
        name: 'liczba dni',
        value: 'daysMin'
    },
    // {
    //     name: 'cena',
    //     value: 'priceBrutto'
    // }
]