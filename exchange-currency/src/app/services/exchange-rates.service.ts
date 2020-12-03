import { mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { CurrencyChanges, CurrencyInfo, ExchangeRateCurrencyInfo, fullCurrenciesNamesMap } from './exchange-rates.model';
import { ExchangeRatesApiService } from './exchange-rates-api.service';
import { Injectable } from '@angular/core';
import { PeriodExchangesRatesApiModel, ExchangesRatesApiModel } from './exchange-rates-api.model';
import { BehaviorSubject, forkJoin, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesService {

  // all currencies
  private baseCurrency = 'PLN';
  private currencies: Map<string, CurrencyInfo> = new Map();
  private currenciesSubject: Subject<Map<string, CurrencyInfo>> = new Subject();
  private mainCurrencies: Map<string, CurrencyInfo> = new Map();
  private mainCurrenciesSubject: Subject<Map<string, CurrencyInfo>> = new Subject();

  private majorsPairs: Map<string, CurrencyInfo> = new Map();
  private majorsPairsSubject: Subject<Map<string, CurrencyInfo>> = new Subject();

  private exchangeRateInfo: Subject<ExchangeRateCurrencyInfo> = new Subject();

  constructor(private exchangeRatesApiService: ExchangeRatesApiService) {
    this.getLastestExchangeRatesFullInfo();
    this.getLastestRatesForMajors();
  }

  public getCurrenciesSubject(): Observable<Map<string, CurrencyInfo>> {
    return this.currenciesSubject;
  }

  public getExchangeRateInfo(): Observable<ExchangeRateCurrencyInfo> {
    return this.exchangeRateInfo;
  }

  public getMainCurrenciesSubject(): Observable<Map<string, CurrencyInfo>> {
    return this.mainCurrenciesSubject;
  }

  public getMajorCurrenciesSubject(): Observable<Map<string, CurrencyInfo>> {
    return this.majorsPairsSubject;
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
        this.updateMainCurrencies();
    }
    );
  }

  public getLastestRatesForMajors(): void {
    forkJoin(
      this.exchangeRatesApiService.getHistoricalRatesWithBaseForSymbol('EUR', 'USD'),
      this.exchangeRatesApiService.getHistoricalRatesWithBaseForSymbol('USD', 'JPY'),
      this.exchangeRatesApiService.getHistoricalRatesWithBaseForSymbol('GBP', 'USD'),
      this.exchangeRatesApiService.getHistoricalRatesWithBaseForSymbol('USD', 'CHF')
    ).pipe(take(1)).subscribe((majorPairs: PeriodExchangesRatesApiModel[]) => {
      this.updateMajorPairsData(majorPairs);
    });
  }

  private updateMajorPairsData(majorPairsData: PeriodExchangesRatesApiModel[]): void {
    majorPairsData.forEach((pairData: PeriodExchangesRatesApiModel) => {
      const periodDates = Object.keys(pairData.rates);
      const yesterdayData = pairData.rates[periodDates[0]];
      const todayData = pairData.rates[periodDates[1]];
      const quotedCurrency = Object.keys(todayData)[0];
      const latestValue = todayData[quotedCurrency];
      const yesterdayValue = yesterdayData[quotedCurrency];

      this.majorsPairs.set(`${pairData.base}/${quotedCurrency}`, {
        value: latestValue,
        additionalInfo: {
          percentageChange: (latestValue - yesterdayValue) / yesterdayValue * 100,
          valueChange: latestValue - yesterdayValue
        }
      });
    });
    this.majorsPairsSubject.next(this.majorsPairs);
  }

  private updateCurrienciesDataWithPeriodChanges(periodExchangesRates: PeriodExchangesRatesApiModel): void {
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
    if (amount) { this.exchangeRateInfo.next({amount, fromCurrency, toCurrency, rate, amountAfterExchange, date}); }
  }

  private updateMainCurrencies(): void {
    for (const currencyName of this.currencies.keys()) {
      if (['USD', 'EUR', 'GBP', 'CHF'].includes(currencyName)) {
        this.mainCurrencies.set(currencyName, this.currencies.get(currencyName));
      }
    }
    this.mainCurrenciesSubject.next(this.mainCurrencies);
  }

}
