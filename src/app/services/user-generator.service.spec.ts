import { TestBed } from '@angular/core/testing';

import { UserGeneratorService } from './user-generator.service';

describe('UserGeneratorService', () => {
  let service: UserGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
