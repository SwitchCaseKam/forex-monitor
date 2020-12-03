import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label, ThemeService } from 'ng2-charts';

@Component({
  selector: 'app-history-chart',
  templateUrl: './history-chart.component.html',
  styleUrls: ['./history-chart.component.css'],
  providers: [ThemeService]
})
export class HistoryChartComponent implements OnInit, OnDestroy {

  @Input() public dataSet;
  @Input() public dates;

  lineChartLabels: string[];
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
  }

  public ngOnDestroy(): void {
  }
}
