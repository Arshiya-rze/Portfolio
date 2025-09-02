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
      tab: 'Projects',
      title: 'Personal & Portfolio Projects',
      date: 'Ongoing',
      bullets: [
        `<strong>Programming School</strong> — Course management platform for admins/teachers/students, attendance & profiles. <em>Tech:</em> C#, Angular, SASS, Angular Material, TypeScript, Mongo DB, Dotnet.`,
        `<strong>OnlineShop</strong> — Demo e-commerce: admin product CRUD, custom image resizing tool, product filtering/search. <em>Tech:</em> C#, Angular, SASS, Angular Material, TypeScript, Mongo DB, Dotnet.`,
        `<strong>Hallboard</strong> — People discovery/dating-style app: users enter personal details and can be found by others. <em>Tech:</em> C#, Angular, SASS, Angular Material, TypeScript, Mongo DB, Dotnet.`,
        `<strong>SoundWave</strong> — Music portfolio site: upload, search, and listen to tracks. <em>Tech:</em> C#, Angular, SASS, Angular Material, TypeScript, Mongo DB, Dotnet.`,
        `<strong>Tehran Page</strong> — Currency marketplace: admin manages currencies/prices; users can browse, filter, buy; custom exchanges with their own prices. <em>Tech:</em> C#, React, Tailwind, Next.js, TypeScript, My SQL.`,
        `<strong>City Menu</strong> — Restaurant menu management: admin manages menues; users can customise the menu and add their own. <em>Tech:</em> C#, React, Tailwind, Next.js, TypeScript, My SQL.`,
        `<strong>Boom Deal</strong> — Find Cars: users can find the car they want. <em>Tech:</em> Angular, Angular Material, SASS, TypeScript, Mongo DB.`
      ]
    },
    {
      tab: 'DirectDay',
      title: 'Full-Stack Developer',
      date: 'Mar 2025 — Present',
      bullets: [
        'Shipping full-stack features with <strong>Next.js</strong> & <strong>C#/.NET</strong> in production.',
        'API design, database modeling, integration, and performance tuning across the stack.',
        'Delivering live products used by real users.',
        `Live projects: <a href="https://tehranpage.com/" target="_blank" rel="noopener">Tehran Page</a> & <a href="https://new.citymenu.app/" target="_blank" rel="noopener">CityMenu</a>.`
      ]
    },
    {
      tab: 'Oyek',
      title: 'Front-End Developer',
      date: 'Sep 2022 — Apr 2023',
      bullets: [
        'Developed UI with <strong>React</strong> + <strong>Vite</strong> using a component-driven approach.',
        'Improved UX/performance, refactored views, and collaborated closely with design & backend.',
        'Focused on clean code, reusability, and accessibility.'
      ]
    }
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
