import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerStatDisplay } from './player-stat-display';

describe('PlayerStatDisplay', () => {
  let component: PlayerStatDisplay;
  let fixture: ComponentFixture<PlayerStatDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerStatDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerStatDisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
