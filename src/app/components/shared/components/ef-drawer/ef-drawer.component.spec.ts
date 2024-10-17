import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EfDrawerComponent } from './ef-drawer.component';

describe('EfDrawerComponent', () => {
  let component: EfDrawerComponent;
  let fixture: ComponentFixture<EfDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EfDrawerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EfDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
