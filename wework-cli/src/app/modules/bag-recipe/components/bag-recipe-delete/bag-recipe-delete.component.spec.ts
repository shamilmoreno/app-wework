import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagRecipeDeleteComponent } from './bag-recipe-delete.component';

describe('BagRecipeDeleteComponent', () => {
  let component: BagRecipeDeleteComponent;
  let fixture: ComponentFixture<BagRecipeDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagRecipeDeleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BagRecipeDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
