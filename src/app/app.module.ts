import { BrowserModule, Title }  from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

import { AppComponent } from './app.component';
import { HashLocationStrategy, LocationStrategy } from "@angular/common";
import { PathLocationStrategy } from "@angular/common";
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Angulartics2Module, Angulartics2GoogleAnalytics } from 'angulartics2';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import 'chart.js/src/chart.js';

import { HomeComponent } from "./home.component";
import { RateComponent } from './rate.component';

import { routing } from "./app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    RateComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule, 
    routing, 
    ChartsModule, 
    HttpModule, 
    FormsModule, 
    ReactiveFormsModule, 
    BrowserAnimationsModule, 
    Angulartics2Module.forRoot([ Angulartics2GoogleAnalytics ]),
    Angulartics2Module.forChild()
  ],
  providers: [{ provide: LocationStrategy, useClass: PathLocationStrategy }, Title],
  bootstrap: [AppComponent]
})
export class AppModule { }