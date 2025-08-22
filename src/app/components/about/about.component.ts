import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ExperienceComponent } from "../experience/experience.component";
import { ProyectsComponent } from "../proyects/proyects.component";
import { ContactComponent } from "../contact/contact.component";

type Dot = { x: number; y: number; vx: number; vy: number };

@Component({
  selector: 'app-about',
  imports: [
    CommonModule, ExperienceComponent, ProyectsComponent,
    ContactComponent
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  standalone: true
})
export class AboutComponent implements OnDestroy, AfterViewInit {

  @ViewChild('aboutRoot', { static: true }) aboutRoot!: ElementRef<HTMLElement>;
  @ViewChild('bgCanvas', { static: true }) bgCanvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private rafId = 0;
  private dots: Dot[] = [];
  private resizeObserver?: ResizeObserver;

  /* پارامترهای قابل تنظیم (برای وضوح بالا مقدارها افزایش داده شده) */
  private speed = 0.35;           // سرعت حرکت
  private connectDist = 160;      // فاصلهٔ اتصال خطوط (px)
  private density = 1 / 14000;    // چگالی (کمتر = ذرات کمتر)
  private maxDots = 140;          // سقف ذرات
  private parallax = { x: 0, y: 0 };

  ngAfterViewInit(): void {
    const cvs = this.bgCanvas.nativeElement;
    const ctx = cvs.getContext('2d', { alpha: true })!;
    this.ctx = ctx;

    /* سایزبندی با درنظرگرفتن DPI برای شفافیت */
    const fit = () => {
      const host = this.aboutRoot.nativeElement;
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2); // حداکثر 2 برای پرف
      cvs.width = Math.max(1, Math.floor(rect.width * dpr));
      cvs.height = Math.max(1, Math.floor(rect.height * dpr));
      cvs.style.width = `${Math.floor(rect.width)}px`;
      cvs.style.height = `${Math.floor(rect.height)}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // از این به بعد با px عادی نقاشی می‌کنیم
      this.spawnDots(Math.floor(rect.width), Math.floor(rect.height));
    };
    fit();

    this.resizeObserver = new ResizeObserver(fit);
    this.resizeObserver.observe(this.aboutRoot.nativeElement);

    /* پارالاکس ملایم با موس/تاچ (اختیاری ولی باعث دیده شدن حرکت می‌شود) */
    const move = (x: number, y: number) => {
      const host = this.aboutRoot.nativeElement.getBoundingClientRect();
      this.parallax.x = ((x - (host.left + host.width / 2)) / host.width) * 8; // حداکثر 8px
      this.parallax.y = ((y - (host.top + host.height / 2)) / host.height) * 8;
    };
    window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY), { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) move(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    this.loop();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    this.resizeObserver?.disconnect();
  }

  /* تولید ذرات */
  private spawnDots(w: number, h: number) {
    const count = Math.min(this.maxDots, Math.max(40, Math.floor(w * h * this.density)));
    this.dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * this.speed,
      vy: (Math.random() - 0.5) * this.speed
    }));
  }

  /* حلقهٔ انیمیشن */
  private loop = () => {
    this.rafId = requestAnimationFrame(this.loop);
    const ctx = this.ctx;
    const cvs = this.bgCanvas.nativeElement;
    const w = cvs.width / (ctx.getTransform().a || 1); // چون setTransform زده‌ایم
    const h = cvs.height / (ctx.getTransform().d || 1);

    ctx.clearRect(0, 0, w, h);

    // حرکت نقاط + برخورد با لبه‌ها
    for (const p of this.dots) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }

    // خطوط بین نقاط نزدیک
    const maxD2 = this.connectDist * this.connectDist;
    ctx.lineWidth = 1.2;
    for (let i = 0; i < this.dots.length; i++) {
      for (let j = i + 1; j < this.dots.length; j++) {
        const a = this.dots[i], b = this.dots[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxD2) {
          const alpha = 0.35 * (1 - Math.sqrt(d2) / this.connectDist); // پررنگ‌تر از قبل
          ctx.strokeStyle = `rgba(100,255,218,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x + this.parallax.x, a.y + this.parallax.y);
          ctx.lineTo(b.x + this.parallax.x, b.y + this.parallax.y);
          ctx.stroke();
        }
      }
    }

    // خودِ نقاط (درشت‌تر و روشن‌تر)
    ctx.fillStyle = 'rgba(157,235,220,0.9)';
    for (const p of this.dots) {
      ctx.beginPath();
      ctx.arc(p.x + this.parallax.x, p.y + this.parallax.y, 2.0, 0, Math.PI * 2);
      ctx.fill();
    }
  };
}