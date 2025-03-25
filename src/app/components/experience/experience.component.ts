import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ExperienceService } from '../../services/experience.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-experience',
  imports: [CommonModule, FormsModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.css'],
  standalone: true
})
export class ExperienceComponent implements OnInit, OnDestroy {
  experiences: any[] = [];
  isEditing = false;
  isLoading = true;
  error = '';
  isAdmin = false;
  currentUsername = '';
  private authSubscription: Subscription | null = null;
  private usernameSubscription: Subscription | null = null;

  constructor(public authService: AuthService, private experienceService: ExperienceService) {
    // Initialize isAdmin from the AuthService
    this.isAdmin = this.authService.isAdmin;
    this.currentUsername = this.authService.currentUsername;
    console.log('Initial admin state:', this.isAdmin);
    console.log('Initial username:', this.currentUsername);
  }

  ngOnInit() {
    // Subscribe to the isAdmin$ Observable
    this.authSubscription = this.authService.isAdmin$.subscribe(isAdmin => {
      console.log('Admin status changed:', isAdmin);
      this.isAdmin = isAdmin;
      // Reload content when admin status changes
      if (isAdmin) {
        this.loadExperienceData();
      }
    });

    // Subscribe to username changes
    this.usernameSubscription = this.authService.currentUsername$.subscribe(username => {
      console.log('Username changed:', username);
      this.currentUsername = username;
      // Reload content when username changes
      if (username) {
        this.loadExperienceData();
      }
    });

    // Initial content load
    this.loadExperienceData();
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

  loadExperienceData() {
    this.isLoading = true;
    this.error = '';
    // Fetch from Firebase using the ExperienceService
    this.experienceService.getExperienceData().subscribe(
      (data: any[]) => {
        this.isLoading = false;
        if (data && data.length > 0) {
          this.experiences = data;
        } else {
          // If no data in Firebase, use default content
          this.experiences = this.experienceService.getDefaultExperience();
          // Save default content to Firebase if user is logged in
          if (this.currentUsername) {
            this.saveExperienceData();
          }
        }
      },
      (error) => {
        this.isLoading = false;
        this.error = 'Error loading experience data. Please try again later.';
        console.error('Error fetching experience data:', error);
        // If error, use default content
        this.experiences = this.experienceService.getDefaultExperience();
      }
    );
  }

  enableEditing() {
    // Only allow editing if the user is an admin
    if (this.isAdmin) {
      this.isEditing = true;
    }
  }

  saveChanges() {
    // Only allow saving if the user is an admin
    if (!this.isAdmin || !this.currentUsername) {
      this.error = 'You must be logged in as an admin to save changes.';
      return;
    }
    
    this.isLoading = true;
    this.isEditing = false;
    this.saveExperienceData();
  }

  cancelEditing() {
    this.isEditing = false;
    // Reload the data to discard changes
    this.loadExperienceData();
  }

  addExperience() {
    this.experiences.push({ year: '', description: '' });
  }

  removeExperience(index: number) {
    this.experiences.splice(index, 1);
  }

  private saveExperienceData() {
    this.experienceService.saveExperienceData(this.experiences).subscribe(
      () => {
        this.isLoading = false;
        console.log('Experience data saved successfully');
      },
      (error) => {
        this.isLoading = false;
        this.error = 'Error saving experience data. Please try again later.';
        console.error('Error saving experience data:', error);
      }
    );
  }
}
