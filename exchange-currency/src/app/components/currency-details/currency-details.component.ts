import { CurrencyDetailsService, HistoricalData, HistoricalDates } from './../../services/currency-details.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { fullCurrenciesNamesMap } from 'src/app/services/exchange-rates.model';

@Component({
  selector: 'app-currency-details',
  templateUrl: './currency-details.component.html',
  styleUrls: ['./currency-details.component.css']
})
export class CurrencyDetailsComponent implements OnInit, OnDestroy {

  public currentCurrencyPair: string;
  public currentCurrencyPairFullName: string;

  public currencyData: HistoricalData;

  constructor(private currencyDetailsService: CurrencyDetailsService) { }

  public ngOnInit() {
    console.log('currency details ON INIT');
    const currentPair = this.currencyDetailsService.getCurrentCurrency();
    this.currentCurrencyPair = `${currentPair.base}/${currentPair.quote}`;
    this.currentCurrencyPairFullName = `${fullCurrenciesNamesMap.get(currentPair.base)} / ${fullCurrenciesNamesMap.get(currentPair.quote)}`;
    this.currencyData = this.currencyDetailsService.getCurrencyPairHistoricalData(HistoricalDates.A_WEEK_AGO);
  }

  public ngOnDestroy() {
    console.log('currency details ON DESTROY');
  }

}
