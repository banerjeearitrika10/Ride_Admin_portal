import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAllocationComponent } from './car-allocation.component';

describe('CarAllocationComponent', () => {
  let component: CarAllocationComponent;
  let fixture: ComponentFixture<CarAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarAllocationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
