import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Disponibilidades } from './disponibilidades';

describe('Disponibilidades', () => {
  let component: Disponibilidades;
  let fixture: ComponentFixture<Disponibilidades>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Disponibilidades]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Disponibilidades);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
