import { ExchangeRatesApiService } from './exchange-rates-api.service';
import { Injectable } from '@angular/core';
import { CurrencyPair } from './exchange-rates.model';
import { take } from 'rxjs/operators';
import { forkJoin, Observable, Subject } from 'rxjs';
import { PeriodExchangesRatesApiModel } from './exchange-rates-api.model';

export interface HistoricalData {
  dates: string[];
  values: string[];
}

export enum HistoricalDates {
  A_WEEK_AGO = 0,
  A_MONTH_AGO = 1,
  THREE_MONTHS_AGO = 2,
  A_YEAR_AGO = 3
}

@Injectable({
  providedIn: 'root'
})

export class CurrencyDetailsService {

  private currentCurrencyPair: CurrencyPair;
  private currencyPairHistoricalData: Map<HistoricalDates, HistoricalData> = new Map();
  private currencyPairHistoricalDataSubject: Subject<Map<HistoricalDates, HistoricalData>> = new Subject();

  constructor(private exchangeRatesApiService: ExchangeRatesApiService) { }

  public getCurrentCurrency(): CurrencyPair {
    return this.currentCurrencyPair;
  }

  public setCurrentCurrenciesPair(base: string, quote: string): void {
    this.currentCurrencyPair = { base, quote };
  }

  public getCurrencyPairHistoricalData(time: HistoricalDates): HistoricalData {
    return this.currencyPairHistoricalData.get(time);
  }

  public getCurrencyPairHistoricalDataSubject(): Observable<Map<number, HistoricalData>> {
    return this.currencyPairHistoricalDataSubject;
  }

  public getHistoricalExchangeRates(): void {
    const dateToday = new Date(Date.now()).toISOString().split('T')[0];
    const dateAWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const dateAMonthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    const date3MonthsAgo = new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0];
    const dateAYearAgo = new Date(Date.now() - 365 * 86400000).toISOString().split('T')[0];

    forkJoin(
      this.exchangeRatesApiService.getHistoricalRatesWithBaseForSymbol(
        this.currentCurrencyPair.base, this.currentCurrencyPair.quote, dateAWeekAgo, dateToday),
      this.exchangeRatesApiService.getHistoricalRatesWithBaseForSymbol(
        this.currentCurrencyPair.base, this.currentCurrencyPair.quote, dateAMonthAgo, dateToday),
      this.exchangeRatesApiService.getHistoricalRatesWithBaseForSymbol(
        this.currentCurrencyPair.base, this.currentCurrencyPair.quote, date3MonthsAgo, dateToday),
        this.exchangeRatesApiService.getHistoricalRatesWithBaseForSymbol(
          this.currentCurrencyPair.base, this.currentCurrencyPair.quote, dateAYearAgo, dateToday)
    ).pipe(take(1)).subscribe((historicalData: PeriodExchangesRatesApiModel[]) => {
      this.updateCurrencyPairHistoricalData(historicalData);
    });
  }

  private updateCurrencyPairHistoricalData(historicalData: PeriodExchangesRatesApiModel[]): void {
    historicalData.forEach((historicalInfo, index) => {
      const dates = Array.from(new Map([...Object.entries(historicalInfo.rates)].sort()).keys());
      const valuesObjects = Array.from(new Map([...Object.entries(historicalInfo.rates)].sort()).values());
      const values = [];
      valuesObjects.forEach((value) => {
        values.push(value[this.currentCurrencyPair.quote]);
      });
      this.currencyPairHistoricalData.set(index, {dates, values})
    });
    this.currencyPairHistoricalDataSubject.next(this.currencyPairHistoricalData);

  }
}
