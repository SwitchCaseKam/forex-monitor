import { ExchangeRatesApiService } from './exchange-rates-api.service';
import { Injectable } from '@angular/core';
import { CurrencyPair, CurrencyInfo } from './exchange-rates.model';
import { take } from 'rxjs/operators';
import { forkJoin, Observable, Subject } from 'rxjs';
import { ExchangesRatesApiModel, PeriodExchangesRatesApiModel } from './exchange-rates-api.model';

export interface HistoricalData {
  dates: string[];
  values: string[];
}

export enum HistoricalDates {
  A_WEEK_AGO = 0,
  A_MONTH_AGO = 1,
  THREE_MONTHS_AGO = 2,
  A_YEAR_AGO = 3,
  THREE_YEARS_AGO = 4,
  FIVE_YEARS_AGO = 5,
  TEN_YEARS_AGO = 6,
}

@Injectable({
  providedIn: 'root'
})

export class CurrencyDetailsService {

  private currentCurrencyPair: CurrencyPair;
  private currencyPairHistoricalData: Map<HistoricalDates, HistoricalData> = new Map();
  private currencyPairHistoricalDataSubject: Subject<Map<HistoricalDates, HistoricalData>> = new Subject();

  private currencyInfoForSelectedDate: CurrencyInfo;
  private currencyInfoForSelectedDateSubject: Subject<CurrencyInfo> = new Subject();

  private currencyInfo: CurrencyInfo;

  constructor(private exchangeRatesApiService: ExchangeRatesApiService) { }

  public getCurrentCurrency(): CurrencyPair {
    return this.currentCurrencyPair;
  }

  public setCurrentCurrenciesPair(base: string, quote: string): void {
    this.currentCurrencyPair = { base, quote };
  }

  public setCurrencyInfo(currencyInfo: CurrencyInfo): void {
    this.currencyInfo = currencyInfo;
  }

  public getCurrencyPairHistoricalData(time: HistoricalDates): HistoricalData {
    return this.currencyPairHistoricalData.get(time);
  }

  public getCurrencyDataForDate(): Observable<Map<number, HistoricalData>> {
    return this.currencyPairHistoricalDataSubject;
  }

  public getCurrencyDataForSelectedDate(time: HistoricalDates): HistoricalData {
    return this.currencyPairHistoricalData.get(time);
  }

  public getCurrencyPairHistoricalDataSubject(): Observable<Map<number, HistoricalData>> {
    return this.currencyPairHistoricalDataSubject;
  }

  public getCurrencyInfoForSelectedDate(): CurrencyInfo {
    return this.currencyInfoForSelectedDate;
  }

  public getCurrencyInfoForSelectedDateSubject(): Observable<CurrencyInfo> {
    return this.currencyInfoForSelectedDateSubject;
  }

  public getCurrencyInfo(): CurrencyInfo {
    return this.currencyInfo;
  }

  public getHistoricalExchangeRates(): void {
    const dateToday = new Date(Date.now()).toISOString().split('T')[0];
    const dateAWeekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
    const dateAMonthAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    const date3MonthsAgo = new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0];
    const dateAYearAgo = new Date(Date.now() - 365 * 86400000).toISOString().split('T')[0];
    const date3YearsAgo = new Date(Date.now() - 3 * 365 * 86400000).toISOString().split('T')[0];
    const date5YearsAgo = new Date(Date.now() - 5 * 365 * 86400000).toISOString().split('T')[0];
    const date10YearsAgo = new Date(Date.now() - 10 * 365 * 86400000).toISOString().split('T')[0];

    forkJoin(
      this.exchangeRatesApiService.getHistoricalRatesWithBaseForSymbol(
        this.currentCurrencyPair.base, this.currentCurrencyPair.quote, dateAWeekAgo, dateToday),
      this.exchangeRatesApiService.getHistoricalRatesWithBaseForSymbol(
        this.currentCurrencyPair.base, this.currentCurrencyPair.quote, dateAMonthAgo, dateToday),
      this.exchangeRatesApiService.getHistoricalRatesWithBaseForSymbol(
        this.currentCurrencyPair.base, this.currentCurrencyPair.quote, date3MonthsAgo, dateToday),
      this.exchangeRatesApiService.getHistoricalRatesWithBaseForSymbol(
        this.currentCurrencyPair.base, this.currentCurrencyPair.quote, dateAYearAgo, dateToday),
      this.exchangeRatesApiService.getHistoricalRatesWithBaseForSymbol(
        this.currentCurrencyPair.base, this.currentCurrencyPair.quote, date3YearsAgo, dateToday),
      this.exchangeRatesApiService.getHistoricalRatesWithBaseForSymbol(
        this.currentCurrencyPair.base, this.currentCurrencyPair.quote, date5YearsAgo, dateToday),
      this.exchangeRatesApiService.getHistoricalRatesWithBaseForSymbol(
        this.currentCurrencyPair.base, this.currentCurrencyPair.quote, date10YearsAgo, dateToday)
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

  public getCurrencyInfoForDate(date: string): void {
    this.exchangeRatesApiService.getRatesForDateWithBaseAndSymbol(date,
      this.currentCurrencyPair.base, this.currentCurrencyPair.quote).subscribe(
        (currencyInfo: ExchangesRatesApiModel) => {
          console.log(currencyInfo);
          const currencyKey = Object.keys(currencyInfo.rates)[0];
          console.log(currencyKey)
          this.currencyInfoForSelectedDate = {value: currencyInfo.rates[currencyKey]};
          this.currencyInfoForSelectedDateSubject.next(this.currencyInfoForSelectedDate);
        }
      );
  }
}
