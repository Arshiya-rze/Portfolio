import { AfterViewInit, Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [RevealOnScrollDirective],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent implements AfterViewInit {
  @ViewChild('bgVideo', { static: true }) bgVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('bannerRoot', { static: true }) bannerRoot!: ElementRef<HTMLElement>;

  private ticking = false;

  constructor(private zone: NgZone) { }

  ngAfterViewInit(): void {
    const v = this.bgVideo.nativeElement;
    v.muted = true;
    const tryPlay = () => v.play().catch(() => {/* autoplay blocked; poster remains */ });
    tryPlay();
    v.addEventListener('canplay', tryPlay, { once: true });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tryPlay(); });

    this.zone.runOutsideAngular(() => {
      const onScroll = () => {
        if (this.ticking) return;
        this.ticking = true;
        requestAnimationFrame(() => {
          this.updateParallax();
          this.ticking = false;
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });

      this.updateParallax();
    });
  }

  private updateParallax(): void {
    const root = this.bannerRoot.nativeElement;
    const bannerH = root.offsetHeight || window.innerHeight;

    const pRaw = window.scrollY / (bannerH * 0.9);
    const p = Math.max(0, Math.min(1, pRaw)); // clamp 0..1

    const titleY = -(p * 24);
    const descY = -(p * 48);
    const titleOp = 1 - p * 0.20;
    const descOp = 1 - p * 0.30;
    const zoom = 1 + p * 0.04;

    root.style.setProperty('--title-y', `${titleY}px`);
    root.style.setProperty('--desc-y', `${descY}px`);
    root.style.setProperty('--title-op', `${titleOp}`);
    root.style.setProperty('--desc-op', `${descOp}`);
    root.style.setProperty('--zoom', `${zoom}`);

    const overlay = 0.88 - p * 0.18;
    root.style.setProperty('--overlay', `${overlay}`);
  }
}