import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtFirebaseComponent } from './tt-firebase.component';

describe('TtFirebaseComponent', () => {
  let component: TtFirebaseComponent;
  let fixture: ComponentFixture<TtFirebaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TtFirebaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TtFirebaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
