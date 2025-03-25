import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredPollsComponent } from './expired-polls.component';

describe('ExpiredPollsComponent', () => {
  let component: ExpiredPollsComponent;
  let fixture: ComponentFixture<ExpiredPollsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpiredPollsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpiredPollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
