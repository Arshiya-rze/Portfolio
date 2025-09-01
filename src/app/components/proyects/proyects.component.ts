import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

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
  imports: [
    CommonModule, MatIconModule
  ],
  templateUrl: './proyects.component.html',
  styleUrl: './proyects.component.scss'
})
export class ProyectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [
    {
      title: 'Programming School',
      description:
        'A site about a programming school that adds the schools course manager and users, meaning those who have registered with this school, can view these courses.Teachers can record attendance and absence for students and view their own students.Users can also view their own and their classmates profiles.',
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
        'An online shop site for demo for those who want to show an online shop site.On this website, the admin can add, update, or even delete products.For each product, he can also choose a photo and these photos can be resized by writing their own tool.Users can also filter and view these products.',
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
        'An app for people to enter their personal details and other people on the app can find them.Its basically a dating app.',
      tech: ['C#', 'Angular', 'SASS', 'Angular Material', 'TypeScript'],
      slides: [
        `${ASSETS}projectHallboard1.png`,
        `${ASSETS}projectHallboard2.png`
      ],
    },
    {
      title: 'SoundWave',
      description:
        'A website for design and design portfolios where you can upload music and search for and listen to that song.',
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
        'A website for currencies where the admin can add different currencies and change the prices. Users can also view, filter and buy these currencies.Users can also add their own exchanges and trade currencies specific to their exchange with their own prices.',
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
