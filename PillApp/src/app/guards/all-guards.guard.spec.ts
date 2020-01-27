import { TestBed, async, inject } from '@angular/core/testing';

import { AllGuardsGuard } from './all-guards.guard';

describe('AllGuardsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AllGuardsGuard]
    });
  });

  it('should ...', inject([AllGuardsGuard], (guard: AllGuardsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
