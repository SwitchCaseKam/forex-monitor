import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CurrencyInfo } from '../../services/exchange-rates.model';
import { ExchangeRatesService } from '../../services/exchange-rates.service';

@Component({
  selector: 'app-majors-panel',
  templateUrl: './majors-panel.component.html',
  styleUrls: ['./majors-panel.component.css']
})
export class MajorsPanelComponent implements OnInit, OnDestroy {

  public majorPairs: string[];
  private majorCurrenciesData: Map<string, CurrencyInfo>;
  private majorCurrenciesSubscription: Subscription;

  constructor(
    private exchangeRatesService: ExchangeRatesService) { }

  public ngOnInit(): void {
    this.majorCurrenciesSubscription = this.exchangeRatesService.getMajorCurrenciesSubject().subscribe(
      (majorPairsData: Map<string, CurrencyInfo>) => {
        this.majorCurrenciesData = majorPairsData;
        this.majorPairs = Array.from(this.majorCurrenciesData.keys());
      }
    );
  }

  public ngOnDestroy(): void {
    this.majorCurrenciesSubscription.unsubscribe();
  }

  public getValuesForPair(pair: string): CurrencyInfo {
    return this.majorCurrenciesData.get(pair);
  }
}
