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

  email = '83arshiarezaie83@gmail.com';
  subject = 'Hello from your portfolio';
  body = 'Hi Arshiya,\n\nWrite your message here...';

  ngAfterViewInit(): void {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.contact .reveal'));

    this.io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
        } else {
          e.target.classList.remove('in-view');
        }
      }),
      { threshold: 0.08 }
    );

    targets.forEach(el => this.io!.observe(el));
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }

  get gmailHref() {
    const base = 'https://mail.google.com/mail/?view=cm&fs=1&tf=1';
    const q = `&to=${encodeURIComponent(this.email)}`
      + `&su=${encodeURIComponent(this.subject)}`
      + `&body=${encodeURIComponent(this.body)}`;
    return base + q;
  }

  get mailtoHref() {
    return `mailto:${this.email}?subject=${encodeURIComponent(this.subject)}&body=${encodeURIComponent(this.body)}`;
  }

  openEmail(ev: MouseEvent) {
    ev.preventDefault();
    const w = window.open(this.gmailHref, '_blank');
    setTimeout(() => {
      try { if (!w || w.closed) window.location.href = this.mailtoHref; }
      catch { window.location.href = this.mailtoHref; }
    }, 300);
  }
}