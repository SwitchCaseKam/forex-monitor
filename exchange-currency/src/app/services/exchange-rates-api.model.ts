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
