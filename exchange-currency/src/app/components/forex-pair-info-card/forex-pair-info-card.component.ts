import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-forex-pair-info-card',
  templateUrl: './forex-pair-info-card.component.html',
  styleUrls: ['./forex-pair-info-card.component.css']
})
export class ForexPairInfoCardComponent implements OnInit {

  @Input()
  currencyPairName: string;

  @Input()
  imgCurrencyFlagUrl: string;

  @Input()
  currentValue: number;

  @Input()
  lastPercentageChange: number;

  @Input()
  lastValueChange: number;

  constructor() { }

  ngOnInit() {
  }

}
