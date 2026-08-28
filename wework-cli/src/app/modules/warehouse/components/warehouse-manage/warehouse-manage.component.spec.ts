import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WareHouseManageComponent } from './warehouse-manage.component';

describe('WareHouseManageComponent', () => {
  let component: WareHouseManageComponent;
  let fixture: ComponentFixture<WareHouseManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WareHouseManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WareHouseManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
