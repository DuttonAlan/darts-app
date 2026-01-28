import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DartKeyboard } from './dart-keyboard';

describe('DartKeyboard', () => {
  let component: DartKeyboard;
  let fixture: ComponentFixture<DartKeyboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DartKeyboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DartKeyboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
