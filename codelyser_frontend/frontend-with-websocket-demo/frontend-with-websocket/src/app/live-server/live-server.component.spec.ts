import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveServerComponent } from './live-server.component';

describe('LiveServerComponent', () => {
  let component: LiveServerComponent;
  let fixture: ComponentFixture<LiveServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiveServerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiveServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
