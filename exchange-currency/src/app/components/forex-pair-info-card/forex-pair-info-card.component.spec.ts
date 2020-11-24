import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForexPairInfoCardComponent } from './forex-pair-info-card.component';

describe('ForexPairInfoCardComponent', () => {
  let component: ForexPairInfoCardComponent;
  let fixture: ComponentFixture<ForexPairInfoCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForexPairInfoCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForexPairInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
