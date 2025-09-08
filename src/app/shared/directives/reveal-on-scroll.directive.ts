import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

type RevealKind = 'fade-up' | 'fade-right' | 'fade-left' | 'zoom-in';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  @Input('appReveal') kind: 'fade-up' | 'fade-right' | 'fade-left' | 'zoom-in' = 'fade-up';
  @Input() revealDelay = 0;
  @Input() revealOnce = true;
  @Input() threshold = 0.15;

  private io?: IntersectionObserver;
  private lastY = window.scrollY;

  constructor(private el: ElementRef, private r: Renderer2) { }

  ngOnInit(): void {
    const node = this.el.nativeElement as HTMLElement;
    this.r.addClass(node, 'reveal');
    this.r.addClass(node, this.kind);
    if (this.revealDelay) node.style.setProperty('--reveal-delay', `${this.revealDelay}ms`);

    this.io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const currentY = window.scrollY;
          if (currentY > this.lastY) {
            this.r.addClass(node, 'scroll-down');
            this.r.removeClass(node, 'scroll-up');
          } else {
            this.r.addClass(node, 'scroll-up');
            this.r.removeClass(node, 'scroll-down');
          }
          this.r.addClass(node, 'is-visible');
          this.lastY = currentY;
        } else if (!this.revealOnce) {
          this.r.removeClass(node, 'is-visible');
          this.r.removeClass(node, 'scroll-down');
          this.r.removeClass(node, 'scroll-up');
        }
      }
    }, { threshold: this.threshold });

    this.io.observe(node);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}