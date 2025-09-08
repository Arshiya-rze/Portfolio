import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

type RevealKind = 'fade-up' | 'fade-right' | 'fade-left' | 'zoom-in';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealOnScrollDirective implements OnInit, OnDestroy {
  @Input('appReveal') kind: RevealKind | '' = 'fade-up';
  @Input() revealDelay = 0;
  @Input() revealOnce = true;
  @Input() threshold = 0.15;
  @Input() rootMargin = '0px 0px -10% 0px';

  private io?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private r: Renderer2) { }

  ngOnInit(): void {
    const node = this.el.nativeElement;
    this.r.addClass(node, 'reveal');
    if (this.kind) this.r.addClass(node, this.kind);
    if (this.revealDelay) node.style.setProperty('--reveal-delay', `${this.revealDelay}ms`);

    this.io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            this.r.addClass(node, 'is-visible');
            if (this.revealOnce) this.io?.unobserve(node);
          } else if (!this.revealOnce) {
            this.r.removeClass(node, 'is-visible');
          }
        }
      },
      { threshold: this.threshold, rootMargin: this.rootMargin }
    );

    this.io.observe(node);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}