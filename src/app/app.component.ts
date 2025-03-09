import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import{CommonModule,NgFor} from '@angular/common';
import { ProjectsComponent } from './components/projects/projects.component';
import { CertificatesComponent } from './components/certificates/certificates.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { SocialComponent } from './components/social/social.component';
import { ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule, ProjectsComponent, CertificatesComponent, ExperienceComponent, SocialComponent,NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'portfolio_inAng';



  @ViewChild('contentSection') contentSection!: ElementRef;

  sections = [
    { id: 'projects', name: 'Projects' },
    { id: 'certificates', name: 'Certificates' },
    { id: 'experience', name: 'Experience' },
    { id: 'social', name: 'Social' }
  ];

  currentSection = 'projects';

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
