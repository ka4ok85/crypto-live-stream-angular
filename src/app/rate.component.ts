import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import EventSource from 'eventsource';
import { environment } from '../environments/environment';


@Component({
    selector: '',
    templateUrl: './templates/rate.html',
    styles: ['']
})


export class RateComponent {

    public currency: string;
    theDataSource: Observable<string>;

    private apiUrl = environment.apiUrl;
    private apiStreamUrlString = "stream?currency=";
    private apiHistoryUrlString = "last?currency=";
    private apiStreamUrl = "";
    private apiHistoryUrl = "";

    public rawData = [];

    public lineChartData: Array<any> = [{ data: [] }];
    public lineChartLabels: Array<any> = [];

    constructor(private http: Http, private route: ActivatedRoute, private titleService: Title) {
        this.currency = route.snapshot.paramMap.get('currency');
    }

    ngOnInit() {
        this.route.data
            .subscribe((data: {}) => {
                this.titleService.setTitle('Rates for ' + this.currency + ' / USD');
                this.apiHistoryUrl = this.apiUrl + this.apiHistoryUrlString + this.currency;
                this.apiStreamUrl = this.apiUrl + this.apiStreamUrlString + this.currency;
            });

        this.getHistoryData(this.apiHistoryUrl);
        this.getData(this.apiStreamUrl);
    }

    public processMessage(e) {
        let data = JSON.parse(e.data);
        this.updateLineChart(data.lastUpdate, data.price);
        //this.busy = this.theDataSource.toPromise();
    }

    public getHistoryData(url: string) {
        console.log(url);
        this.theDataSource = this.http.get(url).map(res => res.json());
        this.rawData = [];

        // Get the data from the REST server
        this.theDataSource.subscribe(
            data => {
                for (let i = 0; i < data.length; i++) {
                    this.updateLineChart(data[i]['lastUpdate'], data[i]['price']);
                }
            },
            err => console.log("Can't get History Rates. Error code: %s, URL: %s ", err.status, err.url),
            () => console.log('History Rates were retrieved')
        );
    }

    public getData(url: string) {
        var source = new EventSource(url);
        source.addEventListener("message", this.processMessage.bind(this), false);
    }

    /* CHARTS */
    public updateLineChart(timestamp: number, price: number) {
        console.log("updateLineChart running");

        let rates: number[];
        rates = this.lineChartData[0].data;

        rates.push(price);

        let date = new Date(timestamp * 1000);

        console.log("Date: " + date);
        let year = date.getFullYear();
        let month = this.pad(date.getMonth() + 1, 2);
        let day = this.pad(date.getDate(), 2);
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        let l = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        console.log(l);

        this.lineChartData = [{ data: rates, label: 'Live Rate' }];
        this.lineChartLabels.push(l);

    }

    public lineChartOptions: any = {
        responsive: true,
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    //unit: 'second',
                    displayFormats: {
                        //day: 'YYYY-MM-DD HH:mm:ss'
                        second: 'hh:mm:ss'
                    }
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: false
                }
            }]
        }
    };

    public lineChartType: string = 'line';
    public lineChartColors: Array<any> = [
        {
            backgroundColor: 'rgba(0, 131, 154,0.2)',
            borderColor: 'rgba(0, 131, 154,1)',
            pointBackgroundColor: 'rgba(0, 131, 154,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0, 131, 154,0.8)'
        }
    ];
    public lineChartLegend: boolean = true;
    public chartClicked(e: any): void {
    }
    public chartHovered(e: any): void {
    }

    public pad(num: number, size: number): string {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }


}