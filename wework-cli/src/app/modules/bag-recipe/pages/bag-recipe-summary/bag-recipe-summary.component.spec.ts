import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagRecipeSummaryComponent } from './bag-recipe-summary.component';

describe('BagRecipeSummaryComponent', () => {
  let component: BagRecipeSummaryComponent;
  let fixture: ComponentFixture<BagRecipeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagRecipeSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BagRecipeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
