import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private firebaseBaseUrl = environment.firebaseConfig.baseUrl;
  private defaultContactInfo: ContactInfo = {
    email: 'sairam@example.com',
    phone: '+91 9876543210',
    location: 'Hyderabad, India',
    socialLinks: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    }
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Gets the Firebase URL for the current user's contact data
   * @returns The URL string for the current user's contact data
   */
  private getUserContactUrl(): string {
    const username = this.authService.currentUsername;
    console.log('Current username from AuthService:', username);
    
    if (!username) {
      console.warn('No username found, using default path');
      return `${this.firebaseBaseUrl}/contact.json`;
    }
    
    const url = `${this.firebaseBaseUrl}/users_data/${username}/contact.json`;
    console.log('Using Firebase URL:', url);
    return url;
  }

  /**
   * Fetches the contact data from Firebase for the current user
   * @returns Observable with the contact data
   */
  getContactData(): Observable<ContactInfo> {
    const url = this.getUserContactUrl();
    console.log('Fetching contact data from:', url);
    
    return this.http.get<ContactInfo>(url).pipe(
      tap(data => {
        console.log('Contact data fetched successfully for user:', this.authService.currentUsername);
        console.log('Data received:', data);
      }),
      catchError(error => {
        console.error('Error fetching contact data:', error);
        // Return default content in case of error
        return of(this.defaultContactInfo);
      })
    );
  }

  /**
   * Saves the contact data to Firebase under the current user
   * @param data The contact data to save
   * @returns Observable with the save operation result
   */
  saveContactData(data: ContactInfo): Observable<any> {
    const url = this.getUserContactUrl();
    console.log('Saving contact data to:', url);
    console.log('Data to save:', data);
    
    return this.http.put(url, data).pipe(
      tap(response => {
        console.log('Contact data saved successfully for user:', this.authService.currentUsername);
        console.log('Firebase response:', response);
      }),
      catchError(error => {
        console.error('Error saving contact data:', error);
        console.error('Error details:', JSON.stringify(error));
        throw error;
      })
    );
  }

  /**
   * Gets the default contact data
   * @returns The default contact data
   */
  getDefaultContactInfo(): ContactInfo {
    return this.defaultContactInfo;
  }
}
