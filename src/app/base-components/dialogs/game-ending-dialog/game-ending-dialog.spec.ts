import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEndingDialog } from './game-ending-dialog';

describe('GameEndingDialog', () => {
  let component: GameEndingDialog;
  let fixture: ComponentFixture<GameEndingDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameEndingDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameEndingDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
