import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AboutComponent } from './components/about/about.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { EducationComponent } from './components/education/education.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ContactComponent } from './components/contact/contact.component';
import { AuthService } from './services/auth.service';
import { ProfileService, ProfileInfo } from './services/profile.service';
import { HttpClientModule } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
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
export class AppComponent implements OnInit, OnDestroy {
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
  
  // Profile related properties
  profileInfo: ProfileInfo = {
    name: 'Sai Ram',
    title: 'Software Developer',
    profileImage: 'assets/profile.jpg'
  };
  isEditingProfile = false;
  profileError = '';
  private authSubscription: Subscription | null = null;
  private usernameSubscription: Subscription | null = null;

  constructor(public authService: AuthService, private profileService: ProfileService) {}

  ngOnInit() {
    this.scrollToSection(this.activeSection);
    
    // Subscribe to the isAdmin$ Observable
    this.authSubscription = this.authService.isAdmin$.subscribe(isAdmin => {
      console.log('Admin status changed in app component:', isAdmin);
      // Reload profile data when admin status changes
      if (isAdmin) {
        this.loadProfileData();
      }
    });

    // Subscribe to username changes
    this.usernameSubscription = this.authService.currentUsername$.subscribe(username => {
      console.log('Username changed in app component:', username);
      // Reload profile data when username changes
      if (username) {
        this.loadProfileData();
      }
    });

    // Initial profile data load
    this.loadProfileData();
  }

  ngOnDestroy() {
    // Clean up subscriptions to prevent memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
  }

  loadProfileData() {
    this.profileError = '';
    // Fetch from Firebase using the ProfileService
    this.profileService.getProfileData().subscribe(
      (data: ProfileInfo) => {
        if (data) {
          this.profileInfo = data;
        } else {
          // If no data in Firebase, use default content
          this.profileInfo = this.profileService.getDefaultProfileInfo();
          // Save default content to Firebase if user is logged in
          if (this.authService.currentUsername) {
            this.saveProfileData();
          }
        }
      },
      (error) => {
        this.profileError = 'Error loading profile data';
        console.error('Error fetching profile data:', error);
        // If error, use default content
        this.profileInfo = this.profileService.getDefaultProfileInfo();
      }
    );
  }

  enableProfileEditing() {
    // Only allow editing if the user is an admin
    if (this.authService.isAdmin) {
      this.isEditingProfile = true;
    }
  }

  saveProfileChanges() {
    // Only allow saving if the user is an admin
    if (!this.authService.isAdmin || !this.authService.currentUsername) {
      this.profileError = 'You must be logged in as an admin to save changes.';
      return;
    }
    
    this.isEditingProfile = false;
    this.saveProfileData();
  }

  cancelProfileEditing() {
    this.isEditingProfile = false;
    // Reload the data to discard changes
    this.loadProfileData();
  }

  private saveProfileData() {
    this.profileService.saveProfileData(this.profileInfo).subscribe(
      () => {
        console.log('Profile data saved successfully');
      },
      (error) => {
        this.profileError = 'Error saving profile data';
        console.error('Error saving profile data:', error);
      }
    );
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