import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChagePasswordComponent } from './user-chage-password.component';

describe('UserChagePasswordComponent', () => {
  let component: UserChagePasswordComponent;
  let fixture: ComponentFixture<UserChagePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserChagePasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserChagePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
