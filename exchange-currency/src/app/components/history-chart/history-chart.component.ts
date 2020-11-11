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

  lineChartData: ChartDataSets[] = [
    { data: [4.85, 4.72, 4.78, 4.75, 4.77, 4.75], label: 'EUR/PLN' },
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

}
