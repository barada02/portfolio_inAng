import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { AboutService } from '../../services/about.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, OnDestroy {
  aboutContent = '';
  isEditing = false;
  editableContent = '';
  isLoading = true;
  error = '';
  isAdmin = false;
  currentUsername = '';
  private authSubscription: Subscription | null = null;
  private usernameSubscription: Subscription | null = null;

  constructor(public authService: AuthService, private aboutService: AboutService) {
    // Initialize isAdmin from the AuthService, not directly from localStorage
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
        this.loadAboutContent();
      }
    });

    // Subscribe to username changes
    this.usernameSubscription = this.authService.currentUsername$.subscribe(username => {
      console.log('Username changed:', username);
      this.currentUsername = username;
      // Reload content when username changes
      if (username) {
        this.loadAboutContent();
      }
    });

    // Initial content load
    this.loadAboutContent();
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

  loadAboutContent() {
    this.isLoading = true;
    this.error = '';
    // Fetch from Firebase using the AboutService
    this.aboutService.getAboutContent().subscribe(
      (data: string) => {
        this.isLoading = false;
        if (data) {
          this.aboutContent = data;
        } else {
          // If no data in Firebase, use default content
          this.aboutContent = this.aboutService.getDefaultContent();
          // Save default content to Firebase if user is logged in
          if (this.currentUsername) {
            this.saveAboutContent();
          }
        }
      },
      (error) => {
        this.isLoading = false;
        this.error = 'Error loading content. Please try again later.';
        console.error('Error fetching about content:', error);
        // If error, use default content
        this.aboutContent = this.aboutService.getDefaultContent();
      }
    );
  }

  enableEditing() {
    // Only allow editing if the user is an admin
    if (this.isAdmin) {
      this.isEditing = true;
      this.editableContent = this.aboutContent;
    }
  }

  saveChanges() {
    // Only allow saving if the user is an admin
    if (!this.isAdmin || !this.currentUsername) {
      this.error = 'You must be logged in as an admin to save changes.';
      return;
    }
    
    this.isLoading = true;
    this.aboutContent = this.editableContent;
    this.isEditing = false;
    this.saveAboutContent();
  }

  cancelEditing() {
    this.isEditing = false;
    this.editableContent = this.aboutContent;
  }

  private saveAboutContent() {
    this.aboutService.saveAboutContent(this.aboutContent).subscribe(
      () => {
        this.isLoading = false;
        console.log('About content saved successfully');
      },
      (error) => {
        this.isLoading = false;
        this.error = 'Error saving content. Please try again later.';
        console.error('Error saving about content:', error);
      }
    );
  }
}
