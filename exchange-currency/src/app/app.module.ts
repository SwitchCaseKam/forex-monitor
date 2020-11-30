import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ExchangerComponent } from './components/exchanger/exchanger.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MainCurrencyPanelComponent } from './components/main-currency-panel/main-currency-panel.component';
import { HeaderComponent } from './components/header/header.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CurrencyDetailsComponent } from './components/currency-details/currency-details.component';
import { ChartsModule } from 'ng2-charts';
import { HistoryChartComponent } from './components/history-chart/history-chart.component';
import { MajorsPanelComponent } from './components/majors-panel/majors-panel.component';
import { MatCardModule } from '@angular/material';
import { ForexPairInfoCardComponent } from './components/forex-pair-info-card/forex-pair-info-card.component';
import { InfoComponent } from './components/info/info.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ExchangerComponent,
    MainCurrencyPanelComponent,
    HeaderComponent,
    CurrencyDetailsComponent,
    HistoryChartComponent,
    MajorsPanelComponent,
    ForexPairInfoCardComponent,
    InfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    ChartsModule,
    MatCardModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [CurrencyDetailsComponent]
})
export class AppModule { }
