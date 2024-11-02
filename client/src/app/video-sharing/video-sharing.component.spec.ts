import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSharingComponent } from './video-sharing.component';

describe('VideoSharingComponent', () => {
  let component: VideoSharingComponent;
  let fixture: ComponentFixture<VideoSharingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoSharingComponent]
    });
    fixture = TestBed.createComponent(VideoSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
