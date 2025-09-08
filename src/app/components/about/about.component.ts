import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { ExperienceComponent } from "../experience/experience.component";
import { ProyectsComponent } from "../proyects/proyects.component";
import { ContactComponent } from "../contact/contact.component";
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive'; // ⬅️ چون در HTML از appReveal استفاده شده

type Dot = { x: number; y: number; vx: number; vy: number };

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ExperienceComponent, ProyectsComponent, ContactComponent, RevealOnScrollDirective],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements AfterViewInit, OnDestroy {

  @ViewChild('aboutRoot', { static: true }) aboutRoot!: ElementRef<HTMLElement>;
  @ViewChild('bgCanvas', { static: true }) bgCanvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private rafId = 0;
  private dots: Dot[] = [];
  private resizeObserver?: ResizeObserver;
  private io?: IntersectionObserver;

  private readonly isMobile =
    matchMedia('(pointer: coarse)').matches || matchMedia('(max-width: 991px)').matches;
  private readonly prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  private intensity = this.isMobile ? 1.6 : 1.45;
  private speed = this.isMobile ? 0.46 : 0.58;
  private connectDist = this.isMobile ? 135 : 175;
  private density = this.isMobile ? 1 / 8000 : 1 / 9000;
  private maxDots = 260;
  private maxLinksPerDot = this.isMobile ? 4 : 6;
  private enableGlow = false;
  private targetFPS = this.prefersReduced ? 30 : (this.isMobile ? 45 : 50);

  private minDotsFloor = this.isMobile ? 130 : 80;

  private frameBudget = 1000 / this.targetFPS;
  private qualityProbeMs = 1200;
  private probeAcc = 0;
  private probeFrames = 0;
  private needRespawn = false;
  private readonly minIntensity = this.isMobile ? 1.10 : 0.75;
  private readonly maxIntensity = this.isMobile ? 2.10 : 1.90;

  private parallax = { x: 0, y: 0 };
  private inView = true;
  private lastT: number | null = null;
  private acc = 0;

  private onMouseMove = (e: MouseEvent) => this.moveParallax(e.clientX, e.clientY);
  private onTouchMove = (e: TouchEvent) => { if (e.touches[0]) this.moveParallax(e.touches[0].clientX, e.touches[0].clientY); };

  private ticking = false;
  private onScroll?: () => void;
  private onResize?: () => void;

  constructor(private zone: NgZone) { }

  ngAfterViewInit(): void {
    this.io = new IntersectionObserver(([e]) => {
      this.inView = e.isIntersecting;
      if (!this.inView) {
        const host = this.aboutRoot.nativeElement;
        host.style.setProperty('--ap-ty', '0px');
        host.style.setProperty('--ap-r', '0deg');
        host.style.setProperty('--ap-s', '1');
        host.style.setProperty('--ap-br-off', '14px');
        host.style.setProperty('--ap-sh', '0.4');
      }
    }, { threshold: 0.05 });
    this.io.observe(this.aboutRoot.nativeElement);

    this.zone.runOutsideAngular(() => {
      this.onScroll = () => {
        if (this.ticking) return;
        this.ticking = true;
        requestAnimationFrame(() => {
          this.updatePhotoParallax();
          this.ticking = false;
        });
      };
      this.onResize = this.onScroll;

      window.addEventListener('scroll', this.onScroll!, { passive: true });
      window.addEventListener('resize', this.onResize!, { passive: true });
      this.updatePhotoParallax();
    });

    const cvs = this.bgCanvas.nativeElement;
    const ctx = cvs.getContext('2d', { alpha: true })!;
    this.ctx = ctx;

    const fit = () => {
      const host = this.aboutRoot.nativeElement;
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cvs.width = Math.max(1, Math.floor(rect.width * dpr));
      cvs.height = Math.max(1, Math.floor(rect.height * dpr));
      cvs.style.width = `${Math.floor(rect.width)}px`;
      cvs.style.height = `${Math.floor(rect.height)}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.spawnDots(Math.floor(rect.width), Math.floor(rect.height));
    };
    fit();

    this.resizeObserver = new ResizeObserver(fit);
    this.resizeObserver.observe(this.aboutRoot.nativeElement);

    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });

    this.rafId = requestAnimationFrame(this.loop);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
    this.io?.disconnect();
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('touchmove', this.onTouchMove);
    if (this.onScroll) window.removeEventListener('scroll', this.onScroll);
    if (this.onResize) window.removeEventListener('resize', this.onResize);
  }

  private get photoEl(): HTMLElement | null {
    return this.aboutRoot?.nativeElement.querySelector('.parallax-photo') as HTMLElement | null;
  }

  private updatePhotoParallax(): void {
    const host = this.aboutRoot.nativeElement;
    const photo = this.photoEl;
    if (!photo) return;

    if (!this.inView) {
      host.style.setProperty('--ap-ty', '0px');
      host.style.setProperty('--ap-r', '0deg');
      host.style.setProperty('--ap-s', '1');
      host.style.setProperty('--ap-br-off', '14px');
      host.style.setProperty('--ap-sh', '0.4');
      return;
    }

    const rect = host.getBoundingClientRect();
    const vh = window.innerHeight || 1;

    const visibleProgress = 1 - Math.min(1, Math.max(0, rect.top / vh));
    const p = Math.max(0, Math.min(1, visibleProgress));

    const translateY = -(p * 36);     // px
    const rotateDeg = (p * 3);      // deg
    const scale = 1 + p * 0.04;
    const borderOff = 14 + (p * 6);  // px
    const shadowK = 0.4 + (p * 0.25);

    host.style.setProperty('--ap-ty', `${translateY}px`);
    host.style.setProperty('--ap-r', `${rotateDeg}deg`);
    host.style.setProperty('--ap-s', `${scale}`);
    host.style.setProperty('--ap-br-off', `${borderOff}px`);
    host.style.setProperty('--ap-sh', `${shadowK}`);
  }

  private moveParallax(x: number, y: number) {
    const host = this.aboutRoot.nativeElement.getBoundingClientRect();
    this.parallax.x = ((x - (host.left + host.width / 2)) / host.width) * 8;
    this.parallax.y = ((y - (host.top + host.height / 2)) / host.height) * 8;
  }

  private spawnDots(w: number, h: number) {
    const base = w * h * this.density * this.intensity;
    const target = Math.max(this.minDotsFloor, Math.floor(base));
    const count = Math.min(this.maxDots, target);

    if (this.dots.length) {
      if (count > this.dots.length) {
        for (let i = this.dots.length; i < count; i++) {
          this.dots.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * this.speed,
            vy: (Math.random() - 0.5) * this.speed,
          });
        }
      } else if (count < this.dots.length) {
        this.dots.splice(count);
      }
      return;
    }

    this.dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * this.speed,
      vy: (Math.random() - 0.5) * this.speed,
    }));
  }

  private loop = (t: number) => {
    this.rafId = requestAnimationFrame(this.loop);

    if (!this.inView) {
      const tr = this.ctx.getTransform();
      const w = this.bgCanvas.nativeElement.width / (tr.a || 1);
      const h = this.bgCanvas.nativeElement.height / (tr.d || 1);
      this.ctx.clearRect(0, 0, w, h);
      return;
    }

    const dt = this.lastT ? (t - this.lastT) : 16;
    this.lastT = t;
    this.acc += dt;
    if (this.acc < this.frameBudget) return;
    const step = this.acc;
    this.acc = 0;

    this.probeAcc += dt;
    this.probeFrames++;

    const ctx = this.ctx;
    const tr = ctx.getTransform();
    const w = this.bgCanvas.nativeElement.width / (tr.a || 1);
    const h = this.bgCanvas.nativeElement.height / (tr.d || 1);
    ctx.clearRect(0, 0, w, h);

    const wobbleX = 0.15, wobbleY = 0.15;
    for (let i = 0; i < this.dots.length; i++) {
      const p = this.dots[i];
      p.x += p.vx * (step / 16) + wobbleX * Math.sin(0.0013 * t + i * 0.7);
      p.y += p.vy * (step / 16) + wobbleY * Math.cos(0.0010 * t + i * 0.7);
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }

    const cell = this.connectDist;
    const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell);
    const buckets: number[][] = Array.from({ length: cols * rows }, () => []);
    for (let i = 0; i < this.dots.length; i++) {
      const p = this.dots[i];
      const cx = Math.max(0, Math.min(cols - 1, (p.x / cell) | 0));
      const cy = Math.max(0, Math.min(rows - 1, (p.y / cell) | 0));
      buckets[cy * cols + cx].push(i);
    }

    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;
    ctx.lineWidth = this.isMobile ? 0.9 : 1.0;
    const maxD2 = this.connectDist * this.connectDist;

    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        const base = cy * cols + cx;
        const here = buckets[base];
        if (!here.length) continue;

        const near: number[] = [];
        const pushCell = (ix: number, iy: number) => {
          if (ix >= 0 && iy >= 0 && ix < cols && iy < rows) {
            const arr = buckets[iy * cols + ix];
            for (let k = 0; k < arr.length; k++) near.push(arr[k]);
          }
        };
        pushCell(cx, cy);
        pushCell(cx + 1, cy); pushCell(cx - 1, cy);
        pushCell(cx, cy + 1); pushCell(cx, cy - 1);
        pushCell(cx + 1, cy + 1); pushCell(cx + 1, cy - 1);
        pushCell(cx - 1, cy + 1); pushCell(cx - 1, cy - 1);

        for (let aIdx = 0; aIdx < here.length; aIdx++) {
          const i = here[aIdx];
          const a = this.dots[i];
          let links = 0;

          for (let k = 0; k < near.length && links < this.maxLinksPerDot; k++) {
            const j = near[k];
            if (j <= i) continue;
            const b = this.dots[j];

            const dx = a.x - b.x, dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < maxD2) {
              const alpha = 0.38 * (1 - Math.sqrt(d2) / this.connectDist);
              ctx.strokeStyle = `rgba(100,255,218,${alpha})`;
              ctx.beginPath();
              ctx.moveTo(a.x + this.parallax.x, a.y + this.parallax.y);
              ctx.lineTo(b.x + this.parallax.x, b.y + this.parallax.y);
              ctx.stroke();
              links++;
            }
          }
        }
      }
    }

    ctx.fillStyle = 'rgba(157,235,220,0.92)';
    for (let i = 0; i < this.dots.length; i++) {
      const p = this.dots[i];
      const r = 1.7 + 0.45 * Math.sin(0.002 * t + i * 1.3);
      ctx.beginPath();
      ctx.arc(p.x + this.parallax.x, p.y + this.parallax.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.probeAcc >= this.qualityProbeMs) {
      const avgFrame = this.probeAcc / Math.max(1, this.probeFrames);
      const downThresh = this.isMobile ? 1.40 : 1.25;
      const upThresh = this.isMobile ? 0.70 : 0.75;

      if (avgFrame > this.frameBudget * downThresh && this.intensity > this.minIntensity) {
        this.intensity = Math.max(this.minIntensity, this.intensity * 0.88);
        this.needRespawn = true;
      } else if (avgFrame < this.frameBudget * upThresh && this.intensity < this.maxIntensity) {
        this.intensity = Math.min(this.maxIntensity, this.intensity * 1.10);
        this.needRespawn = true;
      }

      this.probeAcc = 0;
      this.probeFrames = 0;

      if (this.needRespawn) {
        this.needRespawn = false;
        const trNow = this.ctx.getTransform();
        const ww = this.bgCanvas.nativeElement.width / (trNow.a || 1);
        const hh = this.bgCanvas.nativeElement.height / (trNow.d || 1);
        this.spawnDots(ww, hh);
      }
    }
  };
}