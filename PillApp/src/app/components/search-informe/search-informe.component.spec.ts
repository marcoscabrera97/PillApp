import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInformeComponent } from './search-informe.component';

describe('SearchInformeComponent', () => {
  let component: SearchInformeComponent;
  let fixture: ComponentFixture<SearchInformeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchInformeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
