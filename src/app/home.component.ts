import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: '',
    templateUrl: './templates/home.html',
    styles: ['']
})

export class HomeComponent {

    constructor(private route: ActivatedRoute, private titleService: Title) {

    }

    ngOnInit() {
        this.route.data
            .subscribe((data: {}) => {
                this.titleService.setTitle('Live Crypto Rates');
            });
    }

}