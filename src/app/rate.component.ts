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
    public barChartData: Array<any> = [{ data: [] }];
    public barChartLabels: string[] = [];



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

    public test(e) {
        
        let data = JSON.parse(e.data);

        let dataLabels: string[] = [];
        let dataCounts: string[] = [];
        this.updateLineChart(data.lastUpdate, data.price);
        //this.buildBarChart(dataLabels, dataCounts);            



        //this.busy = this.theDataSource.toPromise();
    }


    public getData(currency: string, url: string) {

        console.log("getData");

        var source = new EventSource(url);
        //source.addEventListener('message', function(e) {
        //source.addEventListener("message", this.test, false);
        source.addEventListener("message", this.test.bind(this), false);

// this.handleDataLoaded.bind(this)

        /*
            let data = JSON.parse(e.data);
            console.log(data);

//test();

            let dataLabels: string[] = [];
            let dataCounts: string[] = [];


            let p : string;
            let l : string;

            l = ""+data.lastUpdate;
            p = ""+data.price;

            dataLabels.push(l);
            dataCounts.push(p);

            console.log( "11111");
            console.log( data.lastUpdate);
            console.log( data.price); 

            console.log( "222");
            console.log( dataCounts);
            console.log( dataLabels);


            this.buildBarChart(dataLabels, dataCounts);            
          }, false);


        //this.busy = this.theDataSource.toPromise();

  */      this.rawData = [];


    }

    /* CHARTS */
    public updateLineChart(label: number, dataCount: number) {
        console.log("updateLineChart running");

        //console.log(this.lineChartData);
        //console.log(this.lineChartData[0]);
        let x: number[];
        x = this.lineChartData[0].data;
        //console.log(x);
        x.push(dataCount);
        console.log(x);

        
        let date = new Date(label*1000);

        //new Date()
        //console.log(label); 
        console.log(date);
        let year = date.getFullYear();
        let month = this.pad(date.getMonth() + 1, 2);
        let day = this.pad(date.getDate(), 2);
        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();

        let l = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        console.log(l);

        this.lineChartData = [{ data: x, label: 'Rate' }];
        this.lineChartLabels.push(l);

    }

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
    public chartClicked(e: any): void {
    }
    public chartHovered(e: any): void {
    }
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