import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameInfos } from './game-infos';

describe('GameInfos', () => {
  let component: GameInfos;
  let fixture: ComponentFixture<GameInfos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameInfos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameInfos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
