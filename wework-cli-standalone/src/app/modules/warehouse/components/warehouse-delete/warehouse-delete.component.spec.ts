import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WareHouseDeleteComponent } from './warehouse-delete.component';

describe('WareHouseDeleteComponent', () => {
  let component: WareHouseDeleteComponent;
  let fixture: ComponentFixture<WareHouseDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WareHouseDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WareHouseDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
