import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameInputDialog } from './name-input-dialog';

describe('NameInputDialog', () => {
  let component: NameInputDialog;
  let fixture: ComponentFixture<NameInputDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NameInputDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NameInputDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
