import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';

import { PokemonService } from '../pokemon.service';
import { Pokemon } from '../pokemon-data.model';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  isLoading = false;
  pokemons: Pokemon[] = [];
  totalPoks = 0;
  poksPerPage = 20;
  currentPagePoks = 0;
  pageSizeOptions = [5, 10, 20];

  constructor(private pokemonService: PokemonService) { }

  ngOnInit() {
    this.isLoading = true;
    this.pokemonService.getData(this.currentPagePoks, this.poksPerPage);
    this.pokemonService.getPoksCountUpdatedListener()
      .subscribe((count: number) => {
        this.totalPoks = count;
      });

    this.pokemonService.getPoksDataUpdateListener()
      .subscribe((poksData: Pokemon[]) => {
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

}
