import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { PokemonService } from '../pokemon.service';
import { Pokemon } from '../pokemon-data.model';

@Component({
  selector: 'app-pokemon-my-collection',
  templateUrl: './pokemon-my-collection.component.html',
  styleUrls: ['./pokemon-my-collection.component.css']
})
export class PokemonMyCollectionComponent implements OnInit, OnDestroy {
  isLoading = false;
  pokemons: Pokemon[] = [];
  collection: any[] = [];
  private poksSubscription = new Subscription();


  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.isLoading = true;
    if (this.pokemonService.fetchColFromLocalStorage()) {
      this.collection = this.pokemonService.fetchColFromLocalStorage();
    }
    this.pokemonService.getPoksById(this.collection);
    this.collection.length === 0 ? this.isLoading = false : this.isLoading = true;
    this.poksSubscription = this.pokemonService.getPoksIdDataUpdateListener()
      .subscribe((poks: Pokemon[]) => {
        this.pokemons = poks;
        this.isLoading = false;
      });
  }

  onCollection(pokemonId: number, event) {
    const index = this.collection.indexOf(pokemonId);
    this.collection.splice(index, 1);
    this.pokemonService.saveColInLocalStorage(this.collection);
    event.target.classList.remove('active');
    this.pokemonService.getPoksById(this.collection);
  }

  ngOnDestroy() {
    this.poksSubscription.unsubscribe();
  }

}
