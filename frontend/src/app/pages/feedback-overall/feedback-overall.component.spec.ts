import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackOverallComponent } from './feedback-overall.component';

describe('FeedbackOverallComponent', () => {
  let component: FeedbackOverallComponent;
  let fixture: ComponentFixture<FeedbackOverallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedbackOverallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackOverallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
