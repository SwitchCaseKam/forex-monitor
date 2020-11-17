import { ExchangeRatesApiService } from './exchange-rates-api.service';
import { Injectable } from '@angular/core';
import { CurrencyPair } from './exchange-rates.model';
import { take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { PeriodExchangesRatesApiModel } from './exchange-rates-api.model';

export interface HistoricalData {
  dates: string[];
  values: string[];
}

export const enum HistoricalDates {
  A_WEEK_AGO = 'aWeekAgo',
  A_MONTH_AGO = 'aMonthkAgo',
  THREE_MONTHS_AGO = 'threeMonthsAgo',
  A_YEAR_AGO = 'aYearAgo'
}

@Injectable({
  providedIn: 'root'
})

export class CurrencyDetailsService {

  private currentCurrencyPair: CurrencyPair;
  private currencyPairHistoricalData: Map<string, HistoricalData> = new Map();

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
    const dateAWeekAgo = historicalData[0];
    const dataAMonthAgo = historicalData[1];
    const data3MonthsAgo = historicalData[2];
    const dataAYearAgo = historicalData[3];

    // historicalData.forEach((historicalInfo, index) => {
    //   const dates = Array.from(new Map([...Object.entries(historicalInfo.rates)].sort()).keys());
    //   const values = Array.from(new Map([...Object.entries(historicalInfo.rates)].sort()).values());
    //   this.currencyPairHistoricalData.set(HistoricalDates[index], {dates, values})
    // });

    let dates = Array.from(new Map([...Object.entries(dateAWeekAgo.rates)].sort()).keys());
    let values = Array.from(new Map([...Object.entries(dateAWeekAgo.rates)].sort()).values());
    this.currencyPairHistoricalData.set(HistoricalDates.A_WEEK_AGO, {dates, values})

    dates = Array.from(new Map([...Object.entries(dataAMonthAgo.rates)].sort()).keys());
    values = Array.from(new Map([...Object.entries(dataAMonthAgo.rates)].sort()).values());
    this.currencyPairHistoricalData.set(HistoricalDates.A_MONTH_AGO, {dates, values})

    dates = Array.from(new Map([...Object.entries(data3MonthsAgo.rates)].sort()).keys());
    values = Array.from(new Map([...Object.entries(data3MonthsAgo.rates)].sort()).values());
    this.currencyPairHistoricalData.set(HistoricalDates.THREE_MONTHS_AGO, {dates, values})

    dates = Array.from(new Map([...Object.entries(dataAYearAgo.rates)].sort()).keys());
    values = Array.from(new Map([...Object.entries(dataAYearAgo.rates)].sort()).values());
    this.currencyPairHistoricalData.set(HistoricalDates.A_YEAR_AGO, {dates, values})

    console.log( this.currencyPairHistoricalData);

    // this.currencyPairHistoricalData.set(HistoricalDates.A_WEEK_AGO, {})
    // this.currencyPairHistoricalData.set(HistoricalDates.A_MONTH_AGO, )
    // this.currencyPairHistoricalData.set(HistoricalDates.THREE_MONTHS_AGO, )
    // this.currencyPairHistoricalData.set(HistoricalDates.A_YEAR_AGO, )
  }
}
