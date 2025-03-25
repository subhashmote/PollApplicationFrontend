import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPollanalysisComponent } from './user-pollanalysis.component';

describe('UserPollanalysisComponent', () => {
  let component: UserPollanalysisComponent;
  let fixture: ComponentFixture<UserPollanalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPollanalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPollanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
