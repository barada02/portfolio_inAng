import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AboutComponent } from './components/about/about.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { EducationComponent } from './components/education/education.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContactComponent } from './components/contact/contact.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AboutComponent,
    ExperienceComponent,
    EducationComponent,
    SkillsComponent,
    ProjectsComponent,
    ContactComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'portfolio_inAng';
  activeSection = 'about';
  showAdminLogin = false;
  fullName = '';
  username = '';
  password = '';
  loginError = '';
  isSignup = false;
  isLoading = false;
  showPortfolio = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.scrollToSection(this.activeSection);
  }

  showResume() {
    this.showPortfolio = true;
  }

  scrollToSection(sectionId: string) {
    this.activeSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const sections = ['about', 'experience', 'education', 'skills', 'projects', 'contact'];
    let currentSection = '';
    let minDistance = Number.MAX_VALUE;

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        if (distance < minDistance) {
          minDistance = distance;
          currentSection = section;
        }
      }
    }

    if (currentSection && this.activeSection !== currentSection) {
      this.activeSection = currentSection;
    }
  }

  showAdminLoginModal() {
    this.showAdminLogin = true;
    this.fullName = '';
    this.username = '';
    this.password = '';
    this.loginError = '';
    this.isSignup = false;
  }

  closeAdminLoginModal() {
    this.showAdminLogin = false;
  }

  toggleSignupMode() {
    this.isSignup = !this.isSignup;
    this.loginError = '';
  }

  login() {
    if (this.isSignup) {
      // Validate signup fields
      if (!this.fullName || !this.username || !this.password) {
        this.loginError = 'Please enter full name, username and password';
        return;
      }
    } else {
      // Validate login fields
      if (!this.username || !this.password) {
        this.loginError = 'Please enter both username and password';
        return;
      }
    }

    this.isLoading = true;
    this.loginError = '';

    if (this.isSignup) {
      // Handle signup
      this.authService.signup(this.fullName, this.username, this.password).subscribe(
        () => {
          // After signup, login automatically
          this.authService.login(this.username, this.password).subscribe(
            (success) => {
              this.isLoading = false;
              if (success) {
                this.showAdminLogin = false;
              } else {
                this.loginError = 'Login failed after signup. Please try again.';
              }
            },
            (error) => {
              this.isLoading = false;
              this.loginError = 'Error during login after signup: ' + (error.message || 'Unknown error');
            }
          );
        },
        (error) => {
          this.isLoading = false;
          this.loginError = 'Signup failed: ' + (error.message || 'Unknown error');
        }
      );
    } else {
      // Handle login
      this.authService.login(this.username, this.password).subscribe(
        (success) => {
          this.isLoading = false;
          if (success) {
            this.showAdminLogin = false;
          } else {
            this.loginError = 'Invalid username or password';
          }
        },
        (error) => {
          this.isLoading = false;
          this.loginError = 'Login error: ' + (error.message || 'Unknown error');
        }
      );
    }
  }

  logout() {
    this.authService.logout();
  }
}