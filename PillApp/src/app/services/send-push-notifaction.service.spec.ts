import { TestBed } from '@angular/core/testing';

import { SendPushNotifactionService } from './send-push-notifaction.service';

describe('SendPushNotifactionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SendPushNotifactionService = TestBed.get(SendPushNotifactionService);
    expect(service).toBeTruthy();
  });
});
