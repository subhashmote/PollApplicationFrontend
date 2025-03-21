import { TestBed } from '@angular/core/testing';

import { PollserviceService } from './pollservice.service';

describe('PollserviceService', () => {
  let service: PollserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PollserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
