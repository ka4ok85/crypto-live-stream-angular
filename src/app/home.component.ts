import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
    selector: '',
    templateUrl: './templates/home.html',
    styles: ['']
})

export class HomeComponent {

    ngOnInit() {
        console.log("start");
        console.log("1");
        let apiUrl = environment.apiUrl;
        console.log(apiUrl);
        console.log("end");
    }


}