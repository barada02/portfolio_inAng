import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { provideLottieOptions } from 'ngx-lottie';
import { AboutComponent } from './components/about/about.component';
import { AchievementsComponent } from './components/achievements/achievements.component';
import { CertificatesComponent } from './components/certificates/certificates.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { EducationComponent } from './components/education/education.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SkillsComponent } from './components/skills/skills.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ProjectsComponent,
    CertificatesComponent,
    ExperienceComponent,
    AboutComponent,
    EducationComponent,
    SkillsComponent,
    AchievementsComponent,
    ContactusComponent,
  ],
  providers: [
    provideLottieOptions({ player: () => import('lottie-web') })
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'portfolio_inAng';
  showPortfolio = false;
  currentSection = 'about';
  showAdminLogin = false;
  adminUsername = '';
  adminPassword = '';
  loginError = false;

  sections = [
    { id: 'about', name: 'About' },
    { id: 'experience', name: 'Experience' },
    { id: 'education', name: 'Education' },
    { id: 'skills', name: 'Skills' },
    { id: 'projects', name: 'Projects' },
    { id: 'achievements', name: 'Achievements' },
    { id: 'certificates', name: 'Certificates' },
    { id: 'contactus', name: 'Contact Us' }
  ];

  @ViewChild('contentSection') contentSection!: ElementRef;

  showResume() {
    this.showPortfolio = true;
    setTimeout(() => this.scrollToTop(), 100);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const scrollPosition = window.scrollY;
    this.sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) {
        const sectionTop = element.offsetTop;
        const sectionHeight = element.clientHeight;
        if (scrollPosition >= sectionTop - 200 && scrollPosition < sectionTop + sectionHeight - 200) {
          this.currentSection = section.id;
        }
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

  openAdminLogin() {
    this.showAdminLogin = true;
  }

  closeAdminLogin() {
    this.showAdminLogin = false;
  }

  loginAdmin() {
    if (this.adminUsername === 'sairam' && this.adminPassword === 'sai123') {
      alert('Login Successful!');
      this.closeAdminLogin();
    } else {
      this.loginError = true;
    }
  }
}
