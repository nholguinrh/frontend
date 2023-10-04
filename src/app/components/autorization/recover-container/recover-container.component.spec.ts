import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverContainerComponent } from './recover-container.component';

describe('RecoverContainerComponent', () => {
  let component: RecoverContainerComponent;
  let fixture: ComponentFixture<RecoverContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoverContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoverContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
