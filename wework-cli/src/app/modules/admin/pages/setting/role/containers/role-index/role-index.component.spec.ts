import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleIndexComponent } from './role-index.component';

describe('RoleIndexComponent', () => {
  let component: RoleIndexComponent;
  let fixture: ComponentFixture<RoleIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
