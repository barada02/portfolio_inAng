import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface ProfileInfo {
  name: string;
  title?: string;
  profileImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private firebaseBaseUrl = environment.firebaseConfig.baseUrl;
  private defaultProfileInfo: ProfileInfo = {
    name: 'Sai Ram',
    title: 'Software Developer',
    profileImage: 'assets/profile.jpg'
  };

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Gets the Firebase URL for the current user's profile data
   * @returns The URL string for the current user's profile data
   */
  private getUserProfileUrl(): string {
    const username = this.authService.currentUsername;
    console.log('Current username from AuthService:', username);
    
    if (!username) {
      console.warn('No username found, using default path');
      return `${this.firebaseBaseUrl}/profile.json`;
    }
    
    const url = `${this.firebaseBaseUrl}/users_data/${username}/profile.json`;
    console.log('Using Firebase URL:', url);
    return url;
  }

  /**
   * Fetches the profile data from Firebase for the current user
   * @returns Observable with the profile data
   */
  getProfileData(): Observable<ProfileInfo> {
    const url = this.getUserProfileUrl();
    console.log('Fetching profile data from:', url);
    
    return this.http.get<ProfileInfo>(url).pipe(
      tap(data => {
        console.log('Profile data fetched successfully for user:', this.authService.currentUsername);
        console.log('Data received:', data);
      }),
      catchError(error => {
        console.error('Error fetching profile data:', error);
        // Return default content in case of error
        return of(this.defaultProfileInfo);
      })
    );
  }

  /**
   * Saves the profile data to Firebase under the current user
   * @param data The profile data to save
   * @returns Observable with the save operation result
   */
  saveProfileData(data: ProfileInfo): Observable<any> {
    const url = this.getUserProfileUrl();
    console.log('Saving profile data to:', url);
    console.log('Data to save:', data);
    
    return this.http.put(url, data).pipe(
      tap(response => {
        console.log('Profile data saved successfully for user:', this.authService.currentUsername);
        console.log('Firebase response:', response);
      }),
      catchError(error => {
        console.error('Error saving profile data:', error);
        console.error('Error details:', JSON.stringify(error));
        throw error;
      })
    );
  }

  /**
   * Gets the default profile data
   * @returns The default profile data
   */
  getDefaultProfileInfo(): ProfileInfo {
    return this.defaultProfileInfo;
  }
}
