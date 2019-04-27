import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { PokemonService } from '../pokemon.service';
import { Pokemon } from '../pokemon-data.model';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit, OnDestroy {
  isLoading = false;
  pokemons: Pokemon[] = [];
  collection: any[] = [];
  totalPoks = 0;
  poksPerPage = 20;
  currentPagePoks = 0;
  pageSizeOptions = [5, 10, 20];
  private poksSubscription = new Subscription();
  private poksCountSubscription = new Subscription();

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.isLoading = true;
    this.pokemonService.getData(this.currentPagePoks, this.poksPerPage);
    this.poksCountSubscription = this.pokemonService.getPoksCountUpdatedListener()
      .subscribe((count: number) => {
        this.totalPoks = count;
      });

    this.poksSubscription = this.pokemonService.getPoksDataUpdateListener()
      .subscribe((poksData: Pokemon[]) => {
        if (this.pokemonService.fetchColFromLocalStorage()) {
          this.collection = this.pokemonService.fetchColFromLocalStorage();
        }
        this.pokemons = poksData;
        this.isLoading = false;
      });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPagePoks = pageData.pageIndex > 0 ? pageData.pageIndex * this.poksPerPage : pageData.pageIndex;
    this.poksPerPage = pageData.pageSize;
    this.pokemonService.getData(this.currentPagePoks, this.poksPerPage);
  }

  onCollection(pokemonId: number, event) {
    if (!this.collection.includes(pokemonId)) {
      this.collection.push(pokemonId);
      this.pokemonService.saveColInLocalStorage(this.collection);
      event.target.classList += ' active';
    } else {
      const index = this.collection.indexOf(pokemonId);
      this.collection.splice(index, 1);
      this.pokemonService.saveColInLocalStorage(this.collection);
      event.target.classList.remove('active');
    }
  }

  ngOnDestroy() {
    this.poksCountSubscription.unsubscribe();
    this.poksSubscription.unsubscribe();
  }

}
