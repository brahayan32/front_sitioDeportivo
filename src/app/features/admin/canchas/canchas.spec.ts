import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Canchas } from './canchas';

describe('Canchas', () => {
  let component: Canchas;
  let fixture: ComponentFixture<Canchas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Canchas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Canchas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
