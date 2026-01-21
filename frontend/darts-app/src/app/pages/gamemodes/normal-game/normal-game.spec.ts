import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NormalGame } from './normal-game';

describe('NormalGame', () => {
  let component: NormalGame;
  let fixture: ComponentFixture<NormalGame>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NormalGame]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NormalGame);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
