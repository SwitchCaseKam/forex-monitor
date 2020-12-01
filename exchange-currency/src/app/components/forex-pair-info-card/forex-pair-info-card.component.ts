import { CurrencyDetailsService } from './../../services/currency-details.service';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CurrencyDetailsComponent } from '../currency-details/currency-details.component';

@Component({
  selector: 'app-forex-pair-info-card',
  templateUrl: './forex-pair-info-card.component.html',
  styleUrls: ['./forex-pair-info-card.component.css']
})
export class ForexPairInfoCardComponent implements OnInit {

  @Input() currencyPairName: string;
  @Input() imgCurrencyFlagUrl: string;
  @Input() currentValue: number;
  @Input() lastPercentageChange: number;
  @Input() lastValueChange: number;

  constructor(
    private currencyDetailsService: CurrencyDetailsService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  public moreInfoCallback(currencyButtonEvent: Event) {
    const forexPairName = currencyButtonEvent.target['id'];
    const baseCurrency = forexPairName.substring(0, 3);
    const quotedCurrency = forexPairName.substring(4, 7);

    this.currencyDetailsService.setCurrentCurrenciesPair(baseCurrency, quotedCurrency);
    this.currencyDetailsService.setCurrencyInfo({value: this.currentValue, additionalInfo: {
      valueChange: this.lastValueChange, percentageChange: this.lastPercentageChange
    }});
    this.currencyDetailsService.getHistoricalExchangeRates();
    const dialogRef = this.dialog.open(CurrencyDetailsComponent);
    dialogRef.afterClosed().subscribe();
  }

}
