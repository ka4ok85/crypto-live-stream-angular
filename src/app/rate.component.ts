import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import EventSource from 'eventsource';


@Component({
    selector: '',
    templateUrl: './templates/rate.html',
    styles: ['']
})


export class RateComponent {
    
    public currency: string;
    private apiURL = 'http://localhost:8080/stream?currency=BTC';

    public rawData = [];

    public lineChartData: Array<any> = [{ data: [] }];
    public lineChartLabels: Array<any> = [];

    constructor(private http: Http, private route: ActivatedRoute, private titleService: Title) {
        this.currency = route.snapshot.paramMap.get('currency');

        console.log(this.currency);
    }

    ngOnInit() {
        this.route.data
            .subscribe((data: { }) => {
                this.titleService.setTitle('Rates for ' + this.currency + ' / USD');
                //this.apiURL = data.envSpecific.apiURL;
            });

        this.getData(this.currency, this.apiURL);
    }

    public processMessage(e) {
        let data = JSON.parse(e.data);
        this.updateLineChart(data.lastUpdate, data.price);
        //this.busy = this.theDataSource.toPromise();
    }


    public getData(currency: string, url: string) {
        var source = new EventSource(url);
        source.addEventListener("message", this.processMessage.bind(this), false);
    }

    /* CHARTS */
    public updateLineChart(timestamp: number, price: number) {
        console.log("updateLineChart running");

        let rates: number[];
        rates = this.lineChartData[0].data;

        rates.push(price);
       
        let date = new Date(timestamp*1000);

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
/*
    private buildLineChart(labels: String[], dataCounts: String[]) {
        this.lineChartData = [{ data: dataCounts, label: 'Number of 9-1-1 calls per day' }];
        let labelsCount = this.lineChartLabels.length;
        for (var index = 0; index < labelsCount; index++) {
            this.lineChartLabels.pop();
        }

        for (let label of labels) {
            this.lineChartLabels.push(label);
        }
    }
*/
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

    public pad(num: number, size: number): string {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }


}