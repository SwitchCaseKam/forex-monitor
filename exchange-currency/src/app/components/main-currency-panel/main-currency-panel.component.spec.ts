import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCurrencyPanelComponent } from './main-currency-panel.component';

describe('MainCurrencyPanelComponent', () => {
  let component: MainCurrencyPanelComponent;
  let fixture: ComponentFixture<MainCurrencyPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainCurrencyPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainCurrencyPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
