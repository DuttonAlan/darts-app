import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointDisplay } from './point-display';

describe('PointDisplay', () => {
  let component: PointDisplay;
  let fixture: ComponentFixture<PointDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PointDisplay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointDisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
