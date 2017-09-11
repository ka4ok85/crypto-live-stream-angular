import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { RateComponent } from './rate.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'rates/:currency', component: RateComponent }
];

export const routing = RouterModule.forRoot(routes);