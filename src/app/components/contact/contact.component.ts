import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  private io?: IntersectionObserver;

  ngAfterViewInit(): void {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.contact .reveal'));
    this.io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          this.io?.unobserve(e.target);
        }
      }),
      { threshold: 0.08 }
    );
    targets.forEach(el => this.io!.observe(el));
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}