import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label, ThemeService } from 'ng2-charts';

@Component({
  selector: 'app-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.css'],
  providers: [ThemeService]
})
export class HistoryChartComponent implements OnInit, OnDestroy {

  private dataSet =  [54.85, 11.72, 12.78, 4.75, 5.77, 6.75]

  lineChartData: ChartDataSets[] = [
    { data: this.dataSet, label: 'EUR/PLN' },
  ];

  lineChartLabels: Label[] = ['2020-01-01', '2020-02-01', '2020-03-01', '2020-04-01', '2020-05-01', '2020-06-01'];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,255,0.28)',
    },
  ];

  lineChartType = 'line';
  constructor() { }

  public ngOnInit(): void {
    console.log('history chart component on init');
  }

  public ngOnDestroy(): void {
    console.log('history chart component on destroy');
  }

  public changeDataSet(num: number): void {
    console.log('aa')
    const dataSet1 =  [4.85, 4.72, 4.78, 4.75, 4.77, 4.75];
    const dataSet2 =  [14.85, 44.72, 6.78, 14.75, 4.77, 1.75];
    const dataSet3 =  [54.85, 11.72, 12.78, 4.75, 5.77, 6.75];
    if (num === 1) {
      this.dataSet = dataSet1;
    } else if (num === 2) {
      this.dataSet = dataSet2;
    } else if (num === 3) {
      this.dataSet = dataSet3;
    }
  }
}
