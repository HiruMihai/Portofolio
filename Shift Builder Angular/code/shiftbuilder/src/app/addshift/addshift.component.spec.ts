import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddshiftComponent } from './addshift.component';

describe('AddshiftComponent', () => {
  let component: AddshiftComponent;
  let fixture: ComponentFixture<AddshiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddshiftComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddshiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
