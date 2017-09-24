import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Subscription } from 'rxjs';
import { Observable } from "rxjs/Observable";
import EventSource from 'eventsource';
import { environment } from '../environments/environment';
import { Rate } from './models/rate';

@Component({
    selector: '',
    templateUrl: './templates/rate.html',
    styles: ['']
})

export class RateComponent {

    public currency: string;
    theDataSource: Observable<string>;

    //busy: Subscription;
    busy: Promise<any>;

    private apiUrl = environment.apiUrl;
    private apiStreamUrlString = "stream?currency=";
    private apiHistoryUrlString = "last?currency=";
    private apiStreamUrl = "";
    private apiHistoryUrl = "";

    public lineChartData: Array<any> = [{ data: [] }];
    public lineChartLabels: Array<any> = [];

    public historyChartData: Array<any> = [{ data: [] }];
    public historyChartLabels: Array<any> = [];

    public historyVolumeChartData: Array<any> = [{ data: [] }];
    public historyVolumeChartLabels: Array<any> = [];

    public liveVolumeChartData: Array<any> = [{ data: [] }];
    public liveVolumeChartLabels: Array<any> = [];

    public liveRate: number;
    public liveRateChange: number;

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
        this.updateLineChart(data, 'live');
        this.liveRate = data.price;
    }

    public getHistoryData(url: string) {
        console.log(url);
        this.theDataSource = this.http.get(url).map(res => res.json());
        this.busy = this.theDataSource.toPromise();
        // Get the data from the REST server
        this.theDataSource.subscribe(
            data => {
                for (let i = 0; i < data.length; i++) {
                    let rate: Rate = new Rate(
                        data[i]['exchangeName'],
                        data[i]['fromCurrency'],
                        data[i]['toCurrency'],
                        data[i]['flag'],
                        data[i]['price'],
                        data[i]['lastUpdate'],
                        data[i]['volume24h'],
                        data[i]['volume24hTo']
                    );

                    this.updateLineChart(rate, 'history');
                }
            },
            err => console.log("Can't get History Rates. Error code: %s, URL: %s ", err.status, err.url),
            () => console.log('History Rates were retrieved')
        );
    }

    public getData(url: string) {
        console.log(url);
        var source = new EventSource(url);
        //source.toPromise();
        source.addEventListener("message", this.processMessage.bind(this), false);
        //this.busy = source.toPromise();
        //this.busy = this.http.get('...').subscribe();
    }

    /* CHARTS */
    public updateLineChart(rate: Rate, graphType: string) {
        console.log("updateLineChart running");
        let liveRates: number[] = [];
        let liveVolumes: number[] = [];
        let historyRates: number[] = [];
        let historyVolumes: number[] = [];

        if (graphType == 'live') {
            liveRates = this.lineChartData[0].data;
            liveRates.push(rate.price);
            liveVolumes = this.liveVolumeChartData[0].data;
            liveVolumes.push(rate.volume24h);
        } else if (graphType == 'history') {
            historyRates = this.historyChartData[0].data;
            historyRates.push(rate.price);
            historyVolumes = this.historyVolumeChartData[0].data;
            historyVolumes.push(rate.volume24h);
        }

        let date = new Date(rate.lastUpdate * 1000);

        console.log("Date: " + date);
        console.log("price: " + rate.price);
        console.log("volume: " + rate.volume24h);
        let year = date.getFullYear();
        let month = this.pad(date.getMonth() + 1, 2);
        let day = this.pad(date.getDate(), 2);
        let hour = this.pad(date.getHours(), 2);
        let minute = this.pad(date.getMinutes(), 2);
        let second = this.pad(date.getSeconds(), 2);

        let dateFormatted = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;

        if (graphType == 'live') {
            this.lineChartData = [{ data: liveRates, label: 'Live Rate' }];
            this.lineChartLabels.push(dateFormatted);
            this.liveVolumeChartData = [{ data: liveVolumes, label: 'Live Volumes' }];
            this.liveVolumeChartLabels.push(dateFormatted);
        } else if (graphType == 'history') {
            this.historyChartData = [{ data: historyRates, label: 'History Rate' }];
            this.historyChartLabels.push(dateFormatted);
            this.historyVolumeChartData = [{ data: historyVolumes, label: 'History Volumes' }];
            this.historyVolumeChartLabels.push(dateFormatted);
        }
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