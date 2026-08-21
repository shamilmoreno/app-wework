import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagRecipeIndexComponent } from './bag-recipe-index.component';

describe('BagRecipeIndexComponent', () => {
  let component: BagRecipeIndexComponent;
  let fixture: ComponentFixture<BagRecipeIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagRecipeIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BagRecipeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
