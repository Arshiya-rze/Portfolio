import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

type Slide = string | null;

interface Project {
  title: string;
  description: string;
  tech: string[];
  slides: Slide[];
}

const ASSETS = '/assets/images/';

@Component({
  selector: 'app-proyects',
  imports: [CommonModule],
  templateUrl: './proyects.component.html',
  styleUrl: './proyects.component.scss'
})
export class ProyectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [
    {
      title: 'Programming School',
      description:
        'Application for tracking fuel supply requests for aircraft. Email module, real-time notifications, CSV import & price quotes.',
      tech: ['C#', 'Angular', 'SASS', 'Angular Material', 'TypeScript'],
      slides: [
        `${ASSETS}projectSchool1.png`,
        `${ASSETS}projectSchool2.png`,
        `${ASSETS}projectSchool3.png`,
      ],
    },
    {
      title: 'OnlineShop',
      description:
        'Monitoring application for data query made with Angular and Laravel. Uses charts and dashboards.',
      tech: ['C#', 'Angular', 'SASS', 'Angular Material', 'TypeScript'],
      slides: [
        `${ASSETS}projectOnlineShop1.png`,
        `${ASSETS}projectOnlineShop2.png`,
        `${ASSETS}projectOnlineShop3.png`,
        `${ASSETS}projectOnlineShop4.png`
      ],
    },
    {
      title: 'Hallboard',
      description:
        'Company management app (sales, collection, tracking). WebSockets, schedules, Laravel jobs, WP integrations.',
      tech: ['C#', 'Angular', 'SASS', 'Angular Material', 'TypeScript'],
      slides: [
        `${ASSETS}projectHallboard1.png`,
        `${ASSETS}projectHallboard2.png`
      ],
    },
    {
      title: 'SoundWave',
      description:
        'Water wells & tugboats monitoring platform with auth, configurable graphs/alarms, user management, OpenLayers maps.',
      tech: ['C#', 'Angular', 'SASS', 'Angular Material', 'TypeScript'],
      slides: [
        `${ASSETS}projectSoundwave1.png`,
        `${ASSETS}projectSoundwave2.png`,
        `${ASSETS}projectSoundwave3.png`,
      ],
    },
    {
      title: 'Tehran Page',
      description:
        'Water wells & tugboats monitoring platform with auth, configurable graphs/alarms, user management, OpenLayers maps.',
      tech: ['C#', 'React', 'Tailwind', 'Next.js', 'TypeScript'],
      slides: [
        `${ASSETS}projectTehranPage1.png`,
        `${ASSETS}projectTehranPage2.png`
      ],
    },
  ];

  activeIndex: number[] = [];
  paused: boolean[] = [];
  private autoplayId: any;

  ngOnInit(): void {
    this.activeIndex = this.projects.map(() => 0);
    this.paused = this.projects.map(() => false);
    this.startAutoplay();
  }
  ngOnDestroy(): void {
    clearInterval(this.autoplayId);
  }

  private startAutoplay() {
    clearInterval(this.autoplayId);
    this.autoplayId = setInterval(() => {
      this.projects.forEach((p, i) => {
        if (this.paused[i] || p.slides.length <= 1) return;
        this.activeIndex[i] = (this.activeIndex[i] + 1) % p.slides.length;
      });
    }, 4000);
  }

  next(i: number) { const len = this.projects[i].slides.length; this.activeIndex[i] = (this.activeIndex[i] + 1) % len; }
  prev(i: number) { const len = this.projects[i].slides.length; this.activeIndex[i] = (this.activeIndex[i] - 1 + len) % len; }
  go(i: number, idx: number) { this.activeIndex[i] = idx; }

  onMouse(i: number, inside: boolean) { this.paused[i] = inside; }

  private startX = 0;
  private swipingIdx: number | null = null;
  onPointerDown(i: number, ev: PointerEvent) {
    this.swipingIdx = i;
    this.startX = ev.clientX;
    (ev.target as HTMLElement).setPointerCapture(ev.pointerId);
    this.paused[i] = true;
  }
  onPointerUp(i: number, ev: PointerEvent) {
    if (this.swipingIdx !== i) return;
    const dx = ev.clientX - this.startX;
    if (Math.abs(dx) > 40) dx < 0 ? this.next(i) : this.prev(i);
    this.swipingIdx = null;
    this.paused[i] = false;
  }
}
