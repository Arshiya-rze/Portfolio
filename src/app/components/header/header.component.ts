import { Component, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbNavModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { HamburgerMenuComponent } from '../styles/hamburger-menu/hamburger-menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NgbNavModule, NgbDropdownModule, HamburgerMenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('headerEl', { static: true }) headerRef!: ElementRef<HTMLElement>;

  responsiveMenuVisible = false;
  currentSection: 'about' | 'jobs' | 'projects' | 'contact' = 'about';

  private io?: IntersectionObserver;
  private sectionIds = ['about', 'jobs', 'projects', 'contact'];

  readonly resumeUrl =
    '/assets/cv/' + encodeURIComponent('resume.pdf');


  ngAfterViewInit(): void {
    const opts: IntersectionObserverInit = { root: null, threshold: 0.55 };
    this.io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = (e.target as HTMLElement).id as any;
          if (this.sectionIds.includes(id)) this.currentSection = id;
        }
      });
    }, opts);

    this.sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) this.io!.observe(el);
    });
  }

  @HostListener('document:keydown.escape') onEsc() { this.toggle(false); }

  toggle(open: boolean) {
    this.responsiveMenuVisible = open;
    document.body.style.overflow = open ? 'hidden' : '';
  }

  go(ev: Event, id: string, close = false) {
    ev?.preventDefault();
    if (close) this.toggle(false);

    const el = document.getElementById(id);
    if (!el) return;

    const headerH = this.headerRef?.nativeElement?.offsetHeight ?? 64;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH + 1;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
