import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MajorsPanelComponent } from './majors-panel.component';

describe('MajorsPanelComponent', () => {
  let component: MajorsPanelComponent;
  let fixture: ComponentFixture<MajorsPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MajorsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MajorsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
