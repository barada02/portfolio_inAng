import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { EducationService } from '../../services/education.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent implements OnInit, OnDestroy {
  educationItems: any[] = [];
  isEditing = false;
  isLoading = true;
  error = '';
  isAdmin = false;
  currentUsername = '';
  private authSubscription: Subscription | null = null;
  private usernameSubscription: Subscription | null = null;

  constructor(public authService: AuthService, private educationService: EducationService) {
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
        this.loadEducationData();
      }
    });

    // Subscribe to username changes
    this.usernameSubscription = this.authService.currentUsername$.subscribe(username => {
      console.log('Username changed:', username);
      this.currentUsername = username;
      // Reload content when username changes
      if (username) {
        this.loadEducationData();
      }
    });

    // Initial content load
    this.loadEducationData();
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

  loadEducationData() {
    this.isLoading = true;
    this.error = '';
    // Fetch from Firebase using the EducationService
    this.educationService.getEducationData().subscribe(
      (data: any[]) => {
        this.isLoading = false;
        if (data && data.length > 0) {
          this.educationItems = data;
        } else {
          // If no data in Firebase, use default content
          this.educationItems = this.educationService.getDefaultEducation();
          // Save default content to Firebase if user is logged in
          if (this.currentUsername) {
            this.saveEducationData();
          }
        }
      },
      (error) => {
        this.isLoading = false;
        this.error = 'Error loading education data. Please try again later.';
        console.error('Error fetching education data:', error);
        // If error, use default content
        this.educationItems = this.educationService.getDefaultEducation();
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
    this.saveEducationData();
  }

  cancelEditing() {
    this.isEditing = false;
    // Reload the data to discard changes
    this.loadEducationData();
  }

  addEducation() {
    this.educationItems.push({
      institution: '',
      degree: '',
      year: '',
      description: ''
    });
  }

  removeEducation(index: number) {
    this.educationItems.splice(index, 1);
  }

  private saveEducationData() {
    this.educationService.saveEducationData(this.educationItems).subscribe(
      () => {
        this.isLoading = false;
        console.log('Education data saved successfully');
      },
      (error) => {
        this.isLoading = false;
        this.error = 'Error saving education data. Please try again later.';
        console.error('Error saving education data:', error);
      }
    );
  }
}
