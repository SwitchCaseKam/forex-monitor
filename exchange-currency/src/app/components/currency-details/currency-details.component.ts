import { CurrencyDetailsService, HistoricalData, HistoricalDates } from './../../services/currency-details.service';
import { Component, OnInit } from '@angular/core';
import { CurrencyInfo, fullCurrenciesNamesMap } from 'src/app/services/exchange-rates.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-currency-details',
  templateUrl: './currency-details.component.html',
  styleUrls: ['./currency-details.component.css']
})
export class CurrencyDetailsComponent implements OnInit {

  public currentCurrencyPair: string;
  public currentCurrencyPairFullName: string;

  public currencyData;
  public currencyDates;

  public currencyInfo: CurrencyInfo;

  constructor(private currencyDetailsService: CurrencyDetailsService) { }

  public ngOnInit() {
    const currentPair = this.currencyDetailsService.getCurrentCurrency();
    this.currentCurrencyPair = `${currentPair.base}/${currentPair.quote}`;
    this.currentCurrencyPairFullName = `${fullCurrenciesNamesMap.get(currentPair.base)} / ${fullCurrenciesNamesMap.get(currentPair.quote)}`;
    this.currencyDetailsService.getCurrencyPairHistoricalDataSubject().pipe(take(1)).subscribe(
      (historicalData: Map<number, HistoricalData>) => {
        const pairHistoricalData = historicalData.get(HistoricalDates.A_YEAR_AGO);
        this.currencyData = [
          { data: pairHistoricalData.values, label: this.currentCurrencyPair}
        ];
        this.currencyDates = pairHistoricalData.dates;
      }
    );
    this.currencyInfo = this.currencyDetailsService.getCurrencyInfo();
  }

  public changeDataSet(num: number): void {
    const historicalData = this.currencyDetailsService.getCurrencyPairHistoricalData(num);
    this.currencyData = [
      { data: historicalData.values, label: this.currentCurrencyPair}
    ];
    this.currencyDates = historicalData.dates;
  }
}
