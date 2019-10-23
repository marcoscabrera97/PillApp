import { TestBed, async, inject } from '@angular/core/testing';

import { GuardAuthPatientGuard } from './guard-auth-patient.guard';

describe('GuardAuthPatientGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuardAuthPatientGuard]
    });
  });

  it('should ...', inject([GuardAuthPatientGuard], (guard: GuardAuthPatientGuard) => {
    expect(guard).toBeTruthy();
  }));
});
