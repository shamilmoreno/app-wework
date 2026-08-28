import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagRecipeDetailComponent } from './bag-recipe-detail.component';

describe('BagRecipeDetailComponent', () => {
  let component: BagRecipeDetailComponent;
  let fixture: ComponentFixture<BagRecipeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagRecipeDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BagRecipeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
