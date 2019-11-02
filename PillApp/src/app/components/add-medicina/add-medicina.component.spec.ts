import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMedicinaComponent } from './add-medicina.component';

describe('AddMedicinaComponent', () => {
  let component: AddMedicinaComponent;
  let fixture: ComponentFixture<AddMedicinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMedicinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMedicinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
