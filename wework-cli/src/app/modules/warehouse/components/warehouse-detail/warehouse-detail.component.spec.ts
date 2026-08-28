import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WareHouseDetailComponent } from './warehouse-detail.component';

describe('WareHouseDetailComponent', () => {
  let component: WareHouseDetailComponent;
  let fixture: ComponentFixture<WareHouseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WareHouseDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WareHouseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
