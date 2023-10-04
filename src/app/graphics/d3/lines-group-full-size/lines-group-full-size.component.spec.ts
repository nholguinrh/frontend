import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinesGroupFullSizeComponent } from './lines-group-full-size.component';

describe('LinesGroupFullSizeComponent', () => {
  let component: LinesGroupFullSizeComponent;
  let fixture: ComponentFixture<LinesGroupFullSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinesGroupFullSizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinesGroupFullSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
