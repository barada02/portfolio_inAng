import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ContactService, ContactInfo } from '../../services/contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {
  contactInfo: ContactInfo = {
    email: '',
    phone: '',
    location: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: ''
    }
  };
  isEditing = false;
  isLoading = true;
  error = '';
  isAdmin = false;
  currentUsername = '';
  private authSubscription: Subscription | null = null;
  private usernameSubscription: Subscription | null = null;

  constructor(public authService: AuthService, private contactService: ContactService) {
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
        this.loadContactData();
      }
    });

    // Subscribe to username changes
    this.usernameSubscription = this.authService.currentUsername$.subscribe(username => {
      console.log('Username changed:', username);
      this.currentUsername = username;
      // Reload content when username changes
      if (username) {
        this.loadContactData();
      }
    });

    // Initial content load
    this.loadContactData();
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

  loadContactData() {
    this.isLoading = true;
    this.error = '';
    // Fetch from Firebase using the ContactService
    this.contactService.getContactData().subscribe(
      (data: ContactInfo) => {
        this.isLoading = false;
        if (data) {
          this.contactInfo = data;
        } else {
          // If no data in Firebase, use default content
          this.contactInfo = this.contactService.getDefaultContactInfo();
          // Save default content to Firebase if user is logged in
          if (this.currentUsername) {
            this.saveContactData();
          }
        }
      },
      (error) => {
        this.isLoading = false;
        this.error = 'Error loading contact data. Please try again later.';
        console.error('Error fetching contact data:', error);
        // If error, use default content
        this.contactInfo = this.contactService.getDefaultContactInfo();
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
    this.saveContactData();
  }

  cancelEditing() {
    this.isEditing = false;
    // Reload the data to discard changes
    this.loadContactData();
  }

  private saveContactData() {
    this.contactService.saveContactData(this.contactInfo).subscribe(
      () => {
        this.isLoading = false;
        console.log('Contact data saved successfully');
      },
      (error) => {
        this.isLoading = false;
        this.error = 'Error saving contact data. Please try again later.';
        console.error('Error saving contact data:', error);
      }
    );
  }
}
