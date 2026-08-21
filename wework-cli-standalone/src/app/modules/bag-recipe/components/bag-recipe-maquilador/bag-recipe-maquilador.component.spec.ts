import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BagRecipeMaquiladorComponent } from './bag-recipe-maquilador.component';

describe('BagRecipeMaquiladorComponent', () => {
  let component: BagRecipeMaquiladorComponent;
  let fixture: ComponentFixture<BagRecipeMaquiladorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BagRecipeMaquiladorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BagRecipeMaquiladorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
