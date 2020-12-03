export class ExchangesRatesApiModel {
  rates: Map<string, number>;
  base: string;
  date: string;
}

export class PeriodExchangesRatesApiModel {
  rates: Map<string, Map<string, number>>;
  base: string;
  startAt: string;
  endAt: string;
}

export enum apiUrlEndpoints {
  LATEST = 'latest',
  HISTORY = 'history'
}

export enum apiUrlParameters {
  SYMBOLS = 'symbols',
  BASE = 'base',
  START_AT = 'start_at',
  END_AT = 'end_at',
}
