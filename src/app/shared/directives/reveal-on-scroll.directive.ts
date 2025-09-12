import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

type RevealKind = 'fade-up' | 'fade-right' | 'fade-left' | 'zoom-in' | 'tilt-in' | 'mask-up';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  @Input('appReveal') kind: RevealKind = 'fade-up';
  @Input() revealDelay = 0;
  @Input() revealOnce = false;
  @Input() threshold = 0.15;

  private io?: IntersectionObserver;

  constructor(private el: ElementRef, private r: Renderer2) { }

  ngOnInit(): void {
    const node = this.el.nativeElement as HTMLElement;
    this.r.addClass(node, 'reveal');
    this.r.addClass(node, this.kind);
    if (this.revealDelay) node.style.setProperty('--reveal-delay', `${this.revealDelay}ms`);

    this.io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          this.r.addClass(node, 'is-visible');
        } else {
          if (!this.revealOnce) {
            this.r.removeClass(node, 'is-visible');
          }
        }
      }
    }, { threshold: this.threshold });

    this.io.observe(node);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}