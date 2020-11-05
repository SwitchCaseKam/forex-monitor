import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-currency-details',
  templateUrl: './currency-details.component.html',
  styleUrls: ['./currency-details.component.css']
})
export class CurrencyDetailsComponent implements OnInit, OnDestroy {

  constructor() { }

  public ngOnInit() {
    console.log('currency details ON INIT');
  }

  public ngOnDestroy() {
    console.log('currency details ON DESTROY');
  }

}
