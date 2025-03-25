import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EducationService {
  private firebaseBaseUrl = 'https://angulartest-93e44-default-rtdb.asia-southeast1.firebasedatabase.app';
  private defaultEducation = [
    {
      institution: 'Aurora University',
      degree: 'Master of Computer Applications(MCA)',
      year: '2023 - 2025',
      description: 'Relevant coursework: c++, Java, Python, Algorithms, Web Development, Database Management'
    },
    {
      institution: 'Degree (BSC-Maths)',
      degree: 'Maths, Physics, Computerscience',
      year: '2020 - 2023',
      description: 'Major subjects: Mathematics, Physics, Computer Science.'
    },
    {
      institution: 'Intermediate',
      degree: 'Maths, Physics, Chemistry',
      year: '2018 - 2020',
      description: 'Major subjects: Mathematics, Physics, Chemistry.'
    }
  ];

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Gets the Firebase URL for the current user's education data
   * @returns The URL string for the current user's education data
   */
  private getUserEducationUrl(): string {
    const username = this.authService.currentUsername;
    console.log('Current username from AuthService:', username);
    
    if (!username) {
      console.warn('No username found, using default path');
      return `${this.firebaseBaseUrl}/education.json`;
    }
    
    const url = `${this.firebaseBaseUrl}/users_data/${username}/education.json`;
    console.log('Using Firebase URL:', url);
    return url;
  }

  /**
   * Fetches the education data from Firebase for the current user
   * @returns Observable with the education data
   */
  getEducationData(): Observable<any[]> {
    const url = this.getUserEducationUrl();
    console.log('Fetching education data from:', url);
    
    return this.http.get<any[]>(url).pipe(
      tap(data => {
        console.log('Education data fetched successfully for user:', this.authService.currentUsername);
        console.log('Data received:', data);
      }),
      catchError(error => {
        console.error('Error fetching education data:', error);
        // Return default content in case of error
        return of(this.defaultEducation);
      })
    );
  }

  /**
   * Saves the education data to Firebase under the current user
   * @param data The education data to save
   * @returns Observable with the save operation result
   */
  saveEducationData(data: any[]): Observable<any> {
    const url = this.getUserEducationUrl();
    console.log('Saving education data to:', url);
    console.log('Data to save:', data);
    
    return this.http.put(url, data).pipe(
      tap(response => {
        console.log('Education data saved successfully for user:', this.authService.currentUsername);
        console.log('Firebase response:', response);
      }),
      catchError(error => {
        console.error('Error saving education data:', error);
        console.error('Error details:', JSON.stringify(error));
        throw error;
      })
    );
  }

  /**
   * Gets the default education data
   * @returns The default education data
   */
  getDefaultEducation(): any[] {
    return this.defaultEducation;
  }
}
