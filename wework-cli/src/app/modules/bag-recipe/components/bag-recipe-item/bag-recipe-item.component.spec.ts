import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagRecipeItemComponent } from './bag-recipe-item.component';

describe('BagRecipeItemComponent', () => {
  let component: BagRecipeItemComponent;
  let fixture: ComponentFixture<BagRecipeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagRecipeItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BagRecipeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
