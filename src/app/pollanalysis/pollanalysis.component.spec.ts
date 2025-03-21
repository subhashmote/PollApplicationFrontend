import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollanalysisComponent } from './pollanalysis.component';

describe('PollanalysisComponent', () => {
  let component: PollanalysisComponent;
  let fixture: ComponentFixture<PollanalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PollanalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PollanalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
