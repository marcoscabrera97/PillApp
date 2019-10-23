import { TestBed, async, inject } from '@angular/core/testing';

import { GuardAuthDoctorGuard } from './guard-auth-doctor.guard';

describe('GuardAuthDoctorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuardAuthDoctorGuard]
    });
  });

  it('should ...', inject([GuardAuthDoctorGuard], (guard: GuardAuthDoctorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
