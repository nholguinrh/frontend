import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinesGroupComponent } from './lines-group.component';

describe('LinesGroupComponent', () => {
  let component: LinesGroupComponent;
  let fixture: ComponentFixture<LinesGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinesGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinesGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
