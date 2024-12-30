import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EFQAConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: EFQAConfirmationDialogComponent;
  let fixture: ComponentFixture<EFQAConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EFQAConfirmationDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EFQAConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
