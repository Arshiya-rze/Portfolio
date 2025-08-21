import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-banner',
  imports: [],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent implements AfterViewInit {
  @ViewChild('bgVideo', { static: true }) bgVideo!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    const v = this.bgVideo.nativeElement;
    v.muted = true;

    const tryPlay = () => v.play().catch(() => {/* autoplay blocked; poster remains */ });
    tryPlay();
    v.addEventListener('canplay', tryPlay, { once: true });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) tryPlay();
    });
  }
}
