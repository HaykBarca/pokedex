import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Pokemon } from './pokemon-data.model';

@Injectable({
    providedIn: 'root'
})
export class PokemonService {
    private data: Pokemon[] = [];
    private totalPokemons = new Subject<number>();
    private pokemonsDataSub = new Subject<Pokemon[]>();

    constructor(private httpClient: HttpClient) { }

    getData(offset, limit) {
        const queryParams = `offset=${offset}&limit=${limit}`;
        this.httpClient.get(`https://pokeapi.co/api/v2/pokemon/?${queryParams}`)
            .subscribe(fetchedData => {
                this.totalPokemons.next(fetchedData['count']);
                this.data = [];
                const resCount = fetchedData['results'].length;
                fetchedData['results'].map((item: Object) => {
                    this.httpClient.get(item['url'])
                        .subscribe(pokemon => {
                            const pokData: Pokemon = {
                                id: pokemon['id'],
                                name: pokemon['name'],
                                sprite: pokemon['sprites']['front_default'],
                                type: pokemon['types']
                            };
                            this.data.push(pokData);
                            if (resCount === this.data.length) {
                                this.pokemonsDataSub.next(this.data);
                            }
                        });
                });
            }, err => {
                console.log(err);
            });
    }

    saveColInLocalStorage(coll: any[]) {
        const stringified = JSON.stringify(coll);
        localStorage.setItem('collection', stringified);
    }

    fetchColFromLocalStorage() {
        const parsed = JSON.parse(localStorage.getItem('collection'));
        return parsed;
    }

    getPoksCountUpdatedListener() {
        return this.totalPokemons.asObservable();
    }

    getPoksDataUpdateListener() {
        return this.pokemonsDataSub.asObservable();
    }
}
