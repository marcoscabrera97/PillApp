import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoAppComponentComponent } from './info-app-component.component';

describe('InfoAppComponentComponent', () => {
  let component: InfoAppComponentComponent;
  let fixture: ComponentFixture<InfoAppComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoAppComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoAppComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
