import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagRecipePaymentComponent } from './bag-recipe-payment.component';

describe('BagRecipePaymentComponent', () => {
  let component: BagRecipePaymentComponent;
  let fixture: ComponentFixture<BagRecipePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagRecipePaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BagRecipePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
