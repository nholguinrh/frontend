import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativeTwolinearComponent } from './comparative-twolinear.component';

describe('ComparativeTwolinearComponent', () => {
  let component: ComparativeTwolinearComponent;
  let fixture: ComponentFixture<ComparativeTwolinearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComparativeTwolinearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparativeTwolinearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
