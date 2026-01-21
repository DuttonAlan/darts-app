import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSettingsComponent } from './game-settings';

describe('GameSettings', () => {
  let component: GameSettingsComponent;
  let fixture: ComponentFixture<GameSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameSettingsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
