import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagRecipeListComponent } from './bag-recipe-list.component';

describe('BagRecipeListComponent', () => {
  let component: BagRecipeListComponent;
  let fixture: ComponentFixture<BagRecipeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagRecipeListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BagRecipeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
