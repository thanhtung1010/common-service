import { TestBed } from '@angular/core/testing';

import { TtFirebaseService } from './tt-firebase.service';

describe('TtFirebaseService', () => {
  let service: TtFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TtFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
