import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryOutComponent } from './inventory-out.component';

describe('InventoryOutComponent', () => {
  let component: InventoryOutComponent;
  let fixture: ComponentFixture<InventoryOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryOutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
