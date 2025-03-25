import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface SkillCategory {
  name: string;
  skills: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  private firebaseBaseUrl = environment.firebaseConfig.baseUrl;
  private defaultSkills: SkillCategory[] = [
    {
      name: 'Frontend',
      skills: ['HTML5 & CSS3', 'JavaScript / TypeScript', 'Angular', 'React', 'Responsive Design']
    },
    {
      name: 'Backend',
      skills: ['Node.js', 'Python', 'Java', 'RESTful APIs', 'SQL']
    },
    {
      name: 'Tools & Others',
      skills: ['Git & GitHub', 'PowerPoint', 'Microsoft Word', 'Data Visualization']
    }
  ];

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Gets the Firebase URL for the current user's skills data
   * @returns The URL string for the current user's skills data
   */
  private getUserSkillsUrl(): string {
    const username = this.authService.currentUsername;
    console.log('Current username from AuthService:', username);
    
    if (!username) {
      console.warn('No username found, using default path');
      return `${this.firebaseBaseUrl}/skills.json`;
    }
    
    const url = `${this.firebaseBaseUrl}/users_data/${username}/skills.json`;
    console.log('Using Firebase URL:', url);
    return url;
  }

  /**
   * Fetches the skills data from Firebase for the current user
   * @returns Observable with the skills data
   */
  getSkillsData(): Observable<SkillCategory[]> {
    const url = this.getUserSkillsUrl();
    console.log('Fetching skills data from:', url);
    
    return this.http.get<SkillCategory[]>(url).pipe(
      tap(data => {
        console.log('Skills data fetched successfully for user:', this.authService.currentUsername);
        console.log('Data received:', data);
      }),
      catchError(error => {
        console.error('Error fetching skills data:', error);
        // Return default content in case of error
        return of(this.defaultSkills);
      })
    );
  }

  /**
   * Saves the skills data to Firebase under the current user
   * @param data The skills data to save
   * @returns Observable with the save operation result
   */
  saveSkillsData(data: SkillCategory[]): Observable<any> {
    const url = this.getUserSkillsUrl();
    console.log('Saving skills data to:', url);
    console.log('Data to save:', data);
    
    return this.http.put(url, data).pipe(
      tap(response => {
        console.log('Skills data saved successfully for user:', this.authService.currentUsername);
        console.log('Firebase response:', response);
      }),
      catchError(error => {
        console.error('Error saving skills data:', error);
        console.error('Error details:', JSON.stringify(error));
        throw error;
      })
    );
  }

  /**
   * Gets the default skills data
   * @returns The default skills data
   */
  getDefaultSkills(): SkillCategory[] {
    return this.defaultSkills;
  }
}
