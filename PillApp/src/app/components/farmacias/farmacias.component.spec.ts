import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmaciasComponent } from './farmacias.component';

describe('FarmaciasComponent', () => {
  let component: FarmaciasComponent;
  let fixture: ComponentFixture<FarmaciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmaciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmaciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
