import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

type Dot = { x: number; y: number; vx: number; vy: number };

@Component({
  selector: 'app-about',
  imports: [
    CommonModule
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  standalone: true
})
export class AboutComponent implements OnDestroy, AfterViewInit {

  @ViewChild('aboutRoot', { static: true, read: ElementRef }) aboutRoot?: ElementRef<HTMLElement>;

  private canvas?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;
  private rafId = 0;
  private dots: Dot[] = [];
  private resizeObserver?: ResizeObserver;

  /* تنظیمات بک‌گراند */
  private maxLinesDist = 140;     // فاصلهٔ اتصال خطوط (px)
  private speed = 0.3;            // سرعت حرکت نقاط
  private density = 1 / 18000;    // چگالی نقاط (کوچک‌تر = نقاط کمتر)
  private maxDotsCap = 120;       // سقف نقاط

  ngAfterViewInit(): void {
    this.setupCanvas();
    this.spawnDots();
    this.loop();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
  }

  /* آماده‌سازی بوم */
  private setupCanvas() {
    const host = this.aboutRoot?.nativeElement!;
    this.canvas = host.querySelector<HTMLCanvasElement>('.about-bg')!;
    this.ctx = this.canvas.getContext('2d', { alpha: true })!;

    const fit = () => {
      const rect = host.getBoundingClientRect();
      this.canvas!.width = Math.max(1, Math.floor(rect.width));
      this.canvas!.height = Math.max(1, Math.floor(rect.height));
      this.spawnDots(); // با تغییر اندازه، نقاط را دوباره بساز
    };
    fit();

    this.resizeObserver = new ResizeObserver(fit);
    this.resizeObserver.observe(host);
  }

  /* ساخت نقاط بر اساس مساحت */
  private spawnDots() {
    if (!this.canvas) return;
    const area = this.canvas.width * this.canvas.height;
    const count = Math.min(this.maxDotsCap, Math.max(30, Math.floor(area * this.density)));

    this.dots = Array.from({ length: count }, () => ({
      x: Math.random() * this.canvas!.width,
      y: Math.random() * this.canvas!.height,
      vx: (Math.random() - 0.5) * this.speed,
      vy: (Math.random() - 0.5) * this.speed,
    }));
  }

  /* حلقهٔ نقاشی */
  private loop = () => {
    this.rafId = requestAnimationFrame(this.loop);
    const c = this.canvas, ctx = this.ctx;
    if (!c || !ctx) return;

    ctx.clearRect(0, 0, c.width, c.height);

    // به‌روزرسانی موقعیت‌ها
    for (const p of this.dots) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > c.width) p.vx *= -1;
      if (p.y < 0 || p.y > c.height) p.vy *= -1;
    }

    // خطوط بین نقاط نزدیک
    const maxD2 = this.maxLinesDist * this.maxLinesDist;
    ctx.lineWidth = 1;

    for (let i = 0; i < this.dots.length; i++) {
      for (let j = i + 1; j < this.dots.length; j++) {
        const a = this.dots[i], b = this.dots[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxD2) {
          const alpha = 0.12 * (1 - (Math.sqrt(d2) / this.maxLinesDist));
          ctx.strokeStyle = `rgba(100,255,218,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // رسم خودِ نقاط
    ctx.fillStyle = 'rgba(136,146,176,0.35)';
    for (const p of this.dots) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }
  };
}