import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosableChip } from './closable-chip';

describe('ClosableChip', () => {
  let component: ClosableChip;
  let fixture: ComponentFixture<ClosableChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClosableChip]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClosableChip);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
