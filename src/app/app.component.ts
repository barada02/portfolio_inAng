import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './components/projects/projects.component';
import { CertificatesComponent } from './components/certificates/certificates.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { AboutComponent } from './components/about/about.component';
import { EducationComponent } from './components/education/education.component';
import { SkillsComponent } from './components/skills/skills.component';
import { AchievementsComponent } from './components/achievements/achievements.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ProjectsComponent,
    CertificatesComponent,
    ExperienceComponent,
    AboutComponent,
    EducationComponent,
    SkillsComponent,
    AchievementsComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'portfolio_inAng';

  @ViewChild('contentSection') contentSection!: ElementRef;

  sections = [
    { id: 'about', name: 'About' },
    { id: 'experience', name: 'Experience' },
    { id: 'education', name: 'Education' },
    { id: 'skills', name: 'Skills' },
    { id: 'projects', name: 'Projects' },
    { id: 'achievements', name: 'Achievements' },
    { id: 'certificates', name: 'Certificates' }
  ];

  currentSection = 'about';

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const sections = document.querySelectorAll('.section');
    const scrollPosition = window.scrollY;

    sections.forEach((section) => {
      const sectionTop = (section as HTMLElement).offsetTop;
      const sectionHeight = (section as HTMLElement).clientHeight;

      if (scrollPosition >= sectionTop - 200 && 
          scrollPosition < sectionTop + sectionHeight - 200) {
        this.currentSection = section.id;
      }
    });
  }

  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
