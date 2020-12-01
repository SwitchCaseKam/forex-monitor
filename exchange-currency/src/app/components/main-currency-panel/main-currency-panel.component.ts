import { CurrencyInfo } from './../../services/exchange-rates.model';
import { ExchangeRatesService } from 'src/app/services/exchange-rates.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-currency-panel',
  templateUrl: './main-currency-panel.component.html',
  styleUrls: ['./main-currency-panel.component.css']
})
export class MainCurrencyPanelComponent implements OnInit, OnDestroy {

  public currencies: Map<string, CurrencyInfo> = new Map();
  public currenciesNames: string[];

  public mainCurrencies: Map<string, CurrencyInfo> = new Map();
  public mainCurrenciesNames: string[];
  // currencies available to choose in select field
  public availableCurrencies: string[];
  public baseCurrency;
  private exchangeRatesSubscription = new Subscription();
  private mainCurrenciesExchangeRatesSubscription = new Subscription();

  constructor(
    private exchangeRatesService: ExchangeRatesService,
  ) { }

  public ngOnInit(): void {
    this.exchangeRatesSubscription = this.exchangeRatesService.getCurrenciesSubject().subscribe(
      (exchangeRatesData: Map<string, CurrencyInfo>) => {
        this.baseCurrency = this.exchangeRatesService.getBaseCurrency();
        this.currencies = exchangeRatesData;
        this.availableCurrencies = Array.from(exchangeRatesData.keys());
        this.currenciesNames = this.availableCurrencies.filter(
          cur => cur !== this.exchangeRatesService.getBaseCurrency());
        // this.currenciesNames = this.moveMainCurrenciesToTheBeggining(this.currenciesNames);
      }
    );

    this.mainCurrenciesExchangeRatesSubscription = this.exchangeRatesService.getMainCurrenciesSubject().subscribe(
      (mainCurrenciesExchangeRatesData: Map<string, CurrencyInfo>) => {
        this.baseCurrency = this.exchangeRatesService.getBaseCurrency();
        this.mainCurrencies = mainCurrenciesExchangeRatesData;
        this.mainCurrenciesNames = Array.from(mainCurrenciesExchangeRatesData.keys());
        this.mainCurrenciesNames = this.mainCurrenciesNames.filter(
          cur => cur !== this.exchangeRatesService.getBaseCurrency());
      }
    );
  }

  public ngOnDestroy(): void {
    this.exchangeRatesSubscription.unsubscribe();
  }

  public handleSelectionEvent(event: Event): void {
    this.baseCurrency = event.target['value'];
    this.exchangeRatesService.setBaseCurrency(this.baseCurrency);
  }

  public createFullForexPair(currency: string): string {
    return `${currency}/${this.baseCurrency}`;
  }
}
