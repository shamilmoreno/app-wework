import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagRecipeDeactivateComponent } from './bag-recipe-deactivate.component';

describe('BagRecipeDeactivateComponent', () => {
  let component: BagRecipeDeactivateComponent;
  let fixture: ComponentFixture<BagRecipeDeactivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagRecipeDeactivateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BagRecipeDeactivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
