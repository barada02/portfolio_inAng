import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperienceService {
  private firebaseBaseUrl = environment.firebaseConfig.baseUrl;
  private defaultExperience = [
    { year: '2024', description: '3months Python internship at MVG Innovations' },
    { year: '2024 (November)', description: 'Frontend Developer at Tech Mindsparc Company' },
    { year: '2024', description: 'NPTEL exam on Business Organisation and Management' },
    { year: '2025 (February)', description: 'Presented a Conference Paper' }
  ];

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Gets the Firebase URL for the current user's experience data
   * @returns The URL string for the current user's experience data
   */
  private getUserExperienceUrl(): string {
    const username = this.authService.currentUsername;
    console.log('Current username from AuthService:', username);
    
    if (!username) {
      console.warn('No username found, using default path');
      return `${this.firebaseBaseUrl}/experience.json`;
    }
    
    const url = `${this.firebaseBaseUrl}/users_data/${username}/experience.json`;
    console.log('Using Firebase URL:', url);
    return url;
  }

  /**
   * Fetches the experience data from Firebase for the current user
   * @returns Observable with the experience data
   */
  getExperienceData(): Observable<any[]> {
    const url = this.getUserExperienceUrl();
    console.log('Fetching experience data from:', url);
    
    return this.http.get<any[]>(url).pipe(
      tap(data => {
        console.log('Experience data fetched successfully for user:', this.authService.currentUsername);
        console.log('Data received:', data);
      }),
      catchError(error => {
        console.error('Error fetching experience data:', error);
        // Return default content in case of error
        return of(this.defaultExperience);
      })
    );
  }

  /**
   * Saves the experience data to Firebase under the current user
   * @param data The experience data to save
   * @returns Observable with the save operation result
   */
  saveExperienceData(data: any[]): Observable<any> {
    const url = this.getUserExperienceUrl();
    console.log('Saving experience data to:', url);
    console.log('Data to save:', data);
    
    return this.http.put(url, data).pipe(
      tap(response => {
        console.log('Experience data saved successfully for user:', this.authService.currentUsername);
        console.log('Firebase response:', response);
      }),
      catchError(error => {
        console.error('Error saving experience data:', error);
        console.error('Error details:', JSON.stringify(error));
        throw error;
      })
    );
  }

  /**
   * Gets the default experience data
   * @returns The default experience data
   */
  getDefaultExperience(): any[] {
    return this.defaultExperience;
  }
}
