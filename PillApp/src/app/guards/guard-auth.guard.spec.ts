import { TestBed, async, inject } from '@angular/core/testing';

import { GuardAuthGuard } from './guard-auth.guard';

describe('GuardAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuardAuthGuard]
    });
  });

  it('should ...', inject([GuardAuthGuard], (guard: GuardAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
