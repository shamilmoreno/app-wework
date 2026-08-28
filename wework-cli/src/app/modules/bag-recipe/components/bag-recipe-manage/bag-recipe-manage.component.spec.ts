import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagRecipeManageComponent } from './bag-recipe-manage.component';

describe('BagRecipeManageComponent', () => {
  let component: BagRecipeManageComponent;
  let fixture: ComponentFixture<BagRecipeManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagRecipeManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BagRecipeManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
