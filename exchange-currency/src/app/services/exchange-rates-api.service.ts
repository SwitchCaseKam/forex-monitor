import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PeriodExchangesRatesApiModel, ExchangesRatesApiModel } from './exchange-rates-api.model';

enum apiUrlEndpoints {
  LATEST = 'latest',
  HISTORY = 'history'
}

enum apiUrlParameters {
  SYMBOL = 'symbols',
  BASE = 'base',
  START_AT = 'start_at',
  END_AT = 'end_at',
}

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

  private getDefaultPeriodDates(): string[] {
    const currentHour = Number(new Date(Date.now()).toISOString().split('T')[1].split(':')[0].toString());
    const todayDate = new Date(Date.now()).toISOString().split('T')[0];
    const oneDayBefore = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysBefore = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
    return currentHour >= 15 ? [oneDayBefore, todayDate] : [twoDaysBefore, oneDayBefore];
  }
}
