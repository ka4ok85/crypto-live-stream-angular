//import { Injectable } from '@angular/core';

export class Rate {
    exchangeName: string;
    fromCurrency: string;
    toCurrency: string;
    flag: number;
    price: number;
    lastUpdate: number;
    volume24h: number;
    volume24hTo: number;

    constructor(exchangeName: string, fromCurrency: string, toCurrency: string, flag: number, price: number, lastUpdate: number, volume24h: number, volume24hTo: number) {
        this.exchangeName = exchangeName;
        this.fromCurrency = fromCurrency;
        this.toCurrency = toCurrency;
        this.flag = flag;
        this.price = price;
        this.lastUpdate = lastUpdate;
        this.volume24h = volume24h;
        this.volume24hTo = volume24hTo;
    }

}
