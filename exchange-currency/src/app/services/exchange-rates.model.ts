export interface CurrencyInfo {
  value: number;
  name?: string;
  additionalInfo?: CurrencyChanges;
}

export interface CurrencyChanges {
  percentageChange: number;
  valueChange: number;
}

export interface ExchangeRateCurrencyInfo {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  amountAfterExchange: number;
  date: string;
}

export interface CurrencyPair {
  base: string;
  quote: string;
}

export const fullCurrenciesNamesMap = new Map([
  ['EUR', 'euro'],
  ['CAD', 'dolar kanadyjski'],
  ['HKD', 'dolar Hongkongu'],
  ['ISK', 'korona islandzka'],
  ['PHP', 'peso filipińskie'],
  ['DKK', 'korona duńska'],
  ['HUF', 'forint (Węgry)'],
  ['CZK', 'korona czeska'],
  ['AUD', 'dolar australijski'],
  ['RON', 'lej rumuński'],
  ['SEK', 'korona szwedzka'],
  ['IDR', 'rupia indonezyjska'],
  ['INR', 'rupia indyjska'],
  ['BRL', 'real (Brazylia)'],
  ['RUB', 'rubel rosyjski'],
  ['HRK', 'kuna (Chorwacja)'],
  ['JPY', 'jen (Japonia)'],
  ['THB', 'bat (Tajlandia)'],
  ['CHF', 'frank szwajcarski'],
  ['SGD', 'dolar singapurski'],
  ['PLN', 'złoty polski'],
  ['BGN', 'lew (Bułgaria)'],
  ['TRY', 'lira turecka'],
  ['CNY', 'yuan renminbi (Chiny)'],
  ['NOK', 'korona norweska'],
  ['NZD', 'dolar nowozelandzki'],
  ['ZAR', 'rand (Republika Południowej Afryki)'],
  ['USD', 'dolar amerykański'],
  ['MXN', 'peso meksykańskie'],
  ['ILS', 'nowy izraelski szekel'],
  ['GBP', 'funt szterling'],
  ['KRW', 'won południowokoreański'],
  ['MYR', 'ringgit (Malezja)']
]);
