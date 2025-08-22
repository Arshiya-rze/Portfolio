import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

type Job = {
  tab: string;
  title: string;
  date: string;
  bullets: string[];
};

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent {
  jobs: Job[] = [
    {
      tab: 'Global',
      title: 'Fullstack Developer',
      date: 'May 2023',
      bullets: [
        'Leader in technical decision making',
        'Hiring technical talent for the company',
        'Team leader of the technology department',
        'Creation and maintenance of an internal process management platform for course sales',
        'Programming custom functions and plugins for customizing a WordPress platform',
        'Implementation of continuous integration and daily backups.',
        'Planning and reporting meetings.'
      ]
    },
    {
      tab: 'Proyex', title: 'Frontend Developer', date: '2022 — 2023',
      bullets: [
        'Built reusable Angular components and design system tokens.',
        'Improved Core Web Vitals and page performance.',
        'Collaborated with backend for API contracts & DX.'
      ]
    },
    {
      tab: 'Freelancer', title: 'Frontend / Fullstack', date: '2020 — 2022',
      bullets: [
        'Delivered pixel-perfect SPAs with Angular.',
        'Set up CI/CD, containerized apps, and monitoring.',
        'SEO & accessibility improvements.'
      ]
    },
    {
      tab: 'Moebius', title: 'Frontend Developer', date: '2019 — 2020',
      bullets: ['UI refactors, theming, and performance profiling.', 'Introduced testing culture with Jasmine/Karma.']
    },
    {
      tab: 'TechLatam', title: 'Frontend Developer', date: '2018 — 2019',
      bullets: ['Migrated legacy jQuery views to Angular.', 'State management with RxJS.']
    },
    {
      tab: 'CANTV', title: 'Frontend Developer', date: '2017 — 2018',
      bullets: ['Internal dashboards and reporting modules.', 'Role-based access and auditing.']
    },
    {
      tab: 'IEP', title: 'Frontend Developer', date: '2016 — 2017',
      bullets: ['Landing pages and campaign microsites.', 'Optimized Lighthouse scores.']
    },
  ];

  active = 0;
  select(i: number) { this.active = i; }

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      this.active = (this.active - 1 + this.jobs.length) % this.jobs.length;
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      this.active = (this.active + 1) % this.jobs.length;
    }
  }
}
