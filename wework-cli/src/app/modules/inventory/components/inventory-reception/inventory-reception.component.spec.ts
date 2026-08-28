import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReceptionComponent } from './inventory-reception.component';

describe('InventoryReceptionComponent', () => {
  let component: InventoryReceptionComponent;
  let fixture: ComponentFixture<InventoryReceptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryReceptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
