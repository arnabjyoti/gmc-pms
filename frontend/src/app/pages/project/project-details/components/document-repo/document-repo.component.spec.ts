import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRepoComponent } from './document-repo.component';

describe('DocumentRepoComponent', () => {
  let component: DocumentRepoComponent;
  let fixture: ComponentFixture<DocumentRepoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentRepoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentRepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
