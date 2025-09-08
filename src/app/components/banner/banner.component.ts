import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-banner',
  imports: [RevealOnScrollDirective],
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

    window.addEventListener('scroll', () => {
      const y = Math.min(1, window.scrollY / 300);
      document.querySelector('.banner')?.setAttribute('style', `--overlay:${0.88 - y * 0.18}`);
    }, { passive: true });
  }
}