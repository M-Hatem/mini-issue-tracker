import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueFiltration } from './issue-filtration';

describe('IssueFiltration', () => {
  let component: IssueFiltration;
  let fixture: ComponentFixture<IssueFiltration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueFiltration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueFiltration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
