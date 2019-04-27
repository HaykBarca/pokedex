import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PokemonListComponent } from './poks/pokemon-list/pokemon-list.component';
import { PokemonMyCollectionComponent } from './poks/pokemon-my-collection/pokemon-my-collection.component';

const routes: Routes = [
    { path: '', component: PokemonListComponent },
    { path: 'myCollection', component: PokemonMyCollectionComponent }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
}
