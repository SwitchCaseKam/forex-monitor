import { CurrencyInfo, ExchangeRateCurrencyInfo, fullCurrenciesNamesMap } from './../../services/exchange-rates.model';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ExchangeRatesService } from 'src/app/services/exchange-rates.service';
import { Subject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-exchanger',
  templateUrl: './exchanger.component.html',
  styleUrls: ['./exchanger.component.css']
})
export class ExchangerComponent implements OnInit, OnDestroy {

  public availableCurrencies: string[];
  public amount: number;
  public fromCurrency = 'PLN';
  public toCurrency = 'EUR';
  public currenciesFullNames = fullCurrenciesNamesMap;

  public exchageRateInfo: ExchangeRateCurrencyInfo;

  private exchangeRatesSubscription = new Subscription();

  constructor(private exchangeRatesService: ExchangeRatesService) { }

  public ngOnInit(): void {
    this.exchangeRatesSubscription = this.exchangeRatesService.getCurrenciesSubject().subscribe(
      (exchangeRatesData: Map<string, CurrencyInfo>) => {
        this.availableCurrencies = Array.from(exchangeRatesData.keys());
      }
    );
  }

  public ngOnDestroy(): void {
    this.exchangeRatesSubscription.unsubscribe();
  }

  public handleSelectionEvent(event: Event): void {
    const eventValueCurrencyName = event.target['value'];
    this.amount = Number(eventValueCurrencyName);
  }

  public calculateExchange(): void {
    this.exchangeRatesService.getLatestExchangeRateForSymbolWithBaseParameters(this.amount, this.fromCurrency, this.toCurrency);
    this.exchangeRatesService.getExchangeRateInfo().pipe(take(1)).subscribe(
      (exchangeRateInfo: ExchangeRateCurrencyInfo) => {
        this.exchageRateInfo = exchangeRateInfo;
      }
    );
  }


}
