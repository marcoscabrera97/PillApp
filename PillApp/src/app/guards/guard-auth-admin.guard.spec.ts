import { TestBed, async, inject } from '@angular/core/testing';

import { GuardAuthAdminGuard } from './guard-auth-admin.guard';

describe('GuardAuthAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuardAuthAdminGuard]
    });
  });

  it('should ...', inject([GuardAuthAdminGuard], (guard: GuardAuthAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
