import { ExchangeRatesService } from './../../services/exchange-rates.service';
import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { CurrencyDetailsService } from 'src/app/services/currency-details.service';
import { CurrencyInfo } from 'src/app/services/exchange-rates.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  public selectedDate: string = new Date(Date.now()).toISOString().split('T')[0];
  public currencyInfo: CurrencyInfo;

  constructor(private currencyDetailsService: CurrencyDetailsService ) { }

  ngOnInit() {
    console.log('CALENDAR')
    this.currencyDetailsService.getCurrencyInfoForDate(this.selectedDate);
    this.currencyDetailsService.getCurrencyInfoForSelectedDateSubject().pipe(take(1)).subscribe(
      (currencyInfo: CurrencyInfo) => {
        this.currencyInfo = currencyInfo;
      }
    );
  }

  public changeDataEvent(event): void {
    const epoch = Number(new Date(event['value']).valueOf()) + 86400000;
    console.log('date: ', new Date(epoch))
    const selectedDate = new Date(epoch).toISOString().split('T')[0];
    this.selectedDate = selectedDate;
    this.currencyDetailsService.getCurrencyInfoForDate(selectedDate);
    this.currencyDetailsService.getCurrencyInfoForSelectedDateSubject().pipe(take(1)).subscribe(
      (currencyInfo: CurrencyInfo) => {
        this.currencyInfo = currencyInfo;
      }
    );
  }

}
