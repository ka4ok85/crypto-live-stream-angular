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
    private apiURL = 'http://localhost:8080/stream';

    public rawData = [];
    public barChartData: Array<any> = [{ data: [] }];
    public barChartLabels: string[] = [];

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
    public test2() {
        console.log("test 2");
    }
    public test(e) {
        
        let data = JSON.parse(e.data);
        console.log(data);
this.test2();
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
    //private buildBarChart(labels: string[], dataCounts: string[]) {
    public buildBarChart(labels: string[], dataCounts: string[]) {
        console.log("buildBarChart running");
        this.barChartData = [{ data: dataCounts, label: 'Number of calls per day' }];
        let labelsCount = this.barChartLabels.length;
        for (var index = 0; index < labelsCount; index++) {
            this.barChartLabels.pop();
        }

        for (let label of labels) {
            this.barChartLabels.push(label);
        }
    }

    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };
    public barChartColors: Array<any> = [
        {
            backgroundColor: 'rgba(0, 131, 154,0.2)',
            borderColor: 'rgba(0, 131, 154,1)',
            pointBackgroundColor: 'rgba(0, 131, 154,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(0, 131, 154,0.8)'
        }
    ];
    public chartClicked(e: any): void {
    }
    public chartHovered(e: any): void {
    }
}