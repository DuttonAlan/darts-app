import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KraftAusDemInneren } from './kraft-aus-dem-inneren';

describe('KraftAusDemInneren', () => {
  let component: KraftAusDemInneren;
  let fixture: ComponentFixture<KraftAusDemInneren>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KraftAusDemInneren]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KraftAusDemInneren);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
