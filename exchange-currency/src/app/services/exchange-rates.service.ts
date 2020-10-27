import { mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { CurrencyChanges, CurrencyInfo, ExchangeRateCurrencyInfo, fullCurrenciesNamesMap } from './exchange-rates.model';
import { ExchangeRatesApiService } from './exchange-rates-api.service';
import { Injectable } from '@angular/core';
import { PeriodExchangesRatesApiModel, ExchangesRatesApiModel } from './exchange-rates-api.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {

  // all currencies
  private baseCurrency = 'PLN';
  private currencies: Map<string, CurrencyInfo> = new Map();
  private currenciesSubject: Subject<Map<string, CurrencyInfo>> = new Subject();


  private exchangeRateInfo: Subject<ExchangeRateCurrencyInfo> = new Subject();

  constructor(private exchangeRatesApiService: ExchangeRatesApiService) {
    this.getLastestExchangeRatesFullInfo();
  }

  public getCurrenciesSubject(): Observable<Map<string, CurrencyInfo>> {
    return this.currenciesSubject;
  }

  public getExchangeRateInfo(): Observable<ExchangeRateCurrencyInfo> {
    return this.exchangeRateInfo;
  }

  public setBaseCurrency(currentBase: string): void {
    this.baseCurrency = currentBase;
    this.getLastestExchangeRatesFullInfo();
  }

  public getBaseCurrency(): string {
    return this.baseCurrency;
  }

  public getLatestExchangeRates(): void {
    this.exchangeRatesApiService.getLatesteRates().subscribe(
      (ratesData: ExchangesRatesApiModel) => { this.updateExchangeRatesData(ratesData); }
    );
  }

  public getLatestExchangeRatesWithBaseParameter(base: string = this.baseCurrency): void {
    this.exchangeRatesApiService.getLatestRatesWithBaseParameter(base).pipe(take(1)).subscribe(
      (ratesData: ExchangesRatesApiModel) => { this.updateExchangeRatesData(ratesData); }
    );
  }

  public getLatestExchangeRateForSymbolWithBaseParameters(amount: number,
                                                          base: string = this.baseCurrency,
                                                          symbols: string = this.baseCurrency): void {
    this.exchangeRatesApiService.getLatestExchangeRateForSymbolWithBaseParameters(base, symbols).pipe(take(1)).subscribe(
      (ratesData: ExchangesRatesApiModel) => { this.calculateExchangeRateAmount(amount, ratesData); }
    );
  }

  public getLastestExchangeRatesFullInfo(): void {
    this.exchangeRatesApiService.getLatestRatesWithBaseParameter(this.baseCurrency).pipe(
      take(1),
      tap((exchangesRates: ExchangesRatesApiModel) => this.updateExchangeRatesData(exchangesRates)),
      mergeMap(exchangesRates => this.exchangeRatesApiService.getHistoricalRatesForPeriod(this.baseCurrency))
    ).subscribe(
      (periodExchangesRates: PeriodExchangesRatesApiModel) => {
        this.updateCurrienciesDataWithPeriodChanges(periodExchangesRates);
        this.currenciesSubject.next(this.currencies);
    }
    );
  }

  private updateCurrienciesDataWithPeriodChanges(periodExchangesRates: PeriodExchangesRatesApiModel) {
    const periodDates = Object.keys(periodExchangesRates.rates);
    const yesterdayData = periodExchangesRates.rates[periodDates[0]];
    const todayData = periodExchangesRates.rates[periodDates[1]];

    for (const currency of Object.keys(yesterdayData)) {
      const percentageChange = ((1 / todayData[currency] - 1 / yesterdayData[currency]) / (1 / yesterdayData[currency])) * 100;
      const valueChange = 1 / todayData[currency] - 1 / yesterdayData[currency];
      const currentCurrencyData = this.currencies.get(currency);
      currentCurrencyData.additionalInfo = { percentageChange, valueChange };
      this.currencies.set(currency, currentCurrencyData);
    }
  }

  private updateExchangeRatesData(ratesData: ExchangesRatesApiModel): void {
    for (const [currencyName, value] of Object.entries(ratesData.rates)) {
      this.currencies.set(currencyName, {value: 1 / value, name: fullCurrenciesNamesMap.get(currencyName)});
    }
  }

  private calculateExchangeRateAmount(amount: number, ratesData: ExchangesRatesApiModel): void {
    const fromCurrency = ratesData.base;
    const toCurrency = Array.from(Object.keys(ratesData.rates))[0];
    const rate = Number(ratesData.rates[toCurrency]);
    const amountAfterExchange = amount * rate;
    const date = ratesData.date;
    this.exchangeRateInfo.next({amount, fromCurrency, toCurrency, rate, amountAfterExchange, date});
  }
}
