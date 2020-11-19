import { CurrencyDetailsService, HistoricalData, HistoricalDates } from './../../services/currency-details.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { fullCurrenciesNamesMap } from 'src/app/services/exchange-rates.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-currency-details',
  templateUrl: './currency-details.component.html',
  styleUrls: ['./currency-details.component.css']
})
export class CurrencyDetailsComponent implements OnInit, OnDestroy {

  public currentCurrencyPair: string;
  public currentCurrencyPairFullName: string;

  public currencyData;
  public currencyDates;

  constructor(private currencyDetailsService: CurrencyDetailsService) { }

  public ngOnInit() {
    console.log('currency details ON INIT');
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
  }

  public ngOnDestroy() {
    console.log('currency details ON DESTROY');
  }

  public changeDataSet(num: number): void {
    const historicalData = this.currencyDetailsService.getCurrencyPairHistoricalData(num);
    this.currencyData = [
      { data: historicalData.values, label: this.currentCurrencyPair}
    ];
    this.currencyDates = historicalData.dates;
  }
}
