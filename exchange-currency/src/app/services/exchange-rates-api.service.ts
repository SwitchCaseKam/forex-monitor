import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PeriodExchangesRatesApiModel, ExchangesRatesApiModel, apiUrlEndpoints, apiUrlParameters } from './exchange-rates-api.model';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRatesApiService {

  private defaultBase = 'PLN';
  private apiUrl = 'https://api.exchangeratesapi.io';

  constructor(private http: HttpClient) { }

  // Get the latest foreign exchange reference rates.
  public getLatesteRates(): Observable<ExchangesRatesApiModel> {
    return this.http.get<ExchangesRatesApiModel>(`${this.apiUrl}/${apiUrlEndpoints.LATEST}`);
  }

  // Get historical rates for any day since 1999.
  public getHistoricalRates(date: string): Observable<ExchangesRatesApiModel> {
    return this.http.get<ExchangesRatesApiModel>(`${this.apiUrl}/${date}`);
  }

  // Get the latest foreign exchange reference rates for specific base
  public getLatestRatesWithBaseParameter(base: string = this.defaultBase): Observable<ExchangesRatesApiModel> {
    return this.http.get<ExchangesRatesApiModel>(`${this.apiUrl}/${apiUrlEndpoints.LATEST}?base=${base}`);
  }

  // Get the latest exchnage rate for base
  public getLatestExchangeRateForSymbolWithBaseParameters(base: string = this.defaultBase,
                                                          symbols: string = this.defaultBase): Observable<ExchangesRatesApiModel> {
    return this.http.get<ExchangesRatesApiModel>(`${this.apiUrl}/${apiUrlEndpoints.LATEST}?symbols=${symbols}&base=${base}`);
  }

  public getHistoricalRatesForPeriod(
    base: string = this.defaultBase,
    periodDates: string[] = this.getDefaultPeriodDates()
  ): Observable<PeriodExchangesRatesApiModel> {
    const startAt = periodDates[0];
    const endAt = periodDates[1];
    return this.http.get<PeriodExchangesRatesApiModel>(
      `${this.apiUrl}/${apiUrlEndpoints.HISTORY}?${apiUrlParameters.BASE}=${base}` +
      `&${apiUrlParameters.START_AT}=${startAt}&${apiUrlParameters.END_AT}=${endAt}`
    );
  }

  public getHistoricalRatesWithBaseForSymbol(base: string, symbols: string | string[],
                                             startAt = this.getDefaultPeriodDates()[0],
                                             endAt = this.getDefaultPeriodDates()[1]): Observable<PeriodExchangesRatesApiModel> {
    return this.http.get<PeriodExchangesRatesApiModel>(
      `${this.apiUrl}/${apiUrlEndpoints.HISTORY}?` +
      `${apiUrlParameters.BASE}=${base}&${apiUrlParameters.SYMBOLS}=${symbols}` +
      `&${apiUrlParameters.START_AT}=${startAt}&${apiUrlParameters.END_AT}=${endAt}`
    );
  }

  public getRatesForDateWithBaseAndSymbol(
    date: string, base: string, symbols: string | string[]): Observable<ExchangesRatesApiModel> {
    return this.http.get<ExchangesRatesApiModel>(`${this.apiUrl}/${date}?` +
      `${apiUrlParameters.BASE}=${base}&${apiUrlParameters.SYMBOLS}=${symbols}`
    );
  }

  private getDefaultPeriodDates(): string[] {
    const currentHour = Number(new Date(Date.now()).getHours());
    const currentDayNumber = new Date(Date.now()).getDay();
    switch (currentDayNumber) {
      case 0: // Sunday
        return [this.getDate(3), this.getDate(2)];
      case 1: // Monday
        return currentHour >= 17 ?  [this.getDate(3), this.getDate(0)] : [this.getDate(4), this.getDate(3)];
      case 2: // Tuesday
        return currentHour >= 17 ?  [this.getDate(1), this.getDate(0)] : [this.getDate(4), this.getDate(1)];
      case 6: // Saturday
        return [this.getDate(2), this.getDate(1)];
      default:
        return currentHour >= 17 ?  [this.getDate(1), this.getDate(0)] : [this.getDate(2), this.getDate(1)];
    }
  }

  private getDate(numberOfDaysAgo: number = 0): string {
    return new Date(Date.now() - numberOfDaysAgo * 86400000).toISOString().split('T')[0];
  }
}
