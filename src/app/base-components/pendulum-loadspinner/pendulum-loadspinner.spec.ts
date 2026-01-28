import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendulumLoadspinner } from './pendulum-loadspinner';

describe('PendulumLoadspinner', () => {
  let component: PendulumLoadspinner;
  let fixture: ComponentFixture<PendulumLoadspinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendulumLoadspinner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendulumLoadspinner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
