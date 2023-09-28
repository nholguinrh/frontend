import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BandejaEntradaClienteComponent } from './bandeja-entrada.component';

describe('BandejaEntradaClienteComponent', () => {
  let component: BandejaEntradaClienteComponent;
  let fixture: ComponentFixture<BandejaEntradaClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BandejaEntradaClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BandejaEntradaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
