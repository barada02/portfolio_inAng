import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
  private firebaseBaseUrl = environment.firebaseConfig.baseUrl;
  private defaultContent = 'I am a MCA student passionate about software development, constantly enhancing my knowledge in coding, logical thinking, and problem-solving. I actively engage in hands-on projects, exploring various technologies to deepen my understanding of programming concepts. My approach to work is a blend of dedication and smart thinking, allowing me to efficiently tackle challenges and complete tasks within deadlines.';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Gets the Firebase URL for the current user's about content
   * @returns The URL string for the current user's about content
   */
  private getUserAboutUrl(): string {
    const username = this.authService.currentUsername;
    console.log('Current username from AuthService:', username);
    
    if (!username) {
      console.warn('No username found, using default path');
      return `${this.firebaseBaseUrl}/about.json`;
    }
    
    const url = `${this.firebaseBaseUrl}/users_data/${username}/about.json`;
    console.log('Using Firebase URL:', url);
    return url;
  }

  /**
   * Fetches the about content from Firebase for the current user
   * @returns Observable with the about content
   */
  getAboutContent(): Observable<string> {
    const url = this.getUserAboutUrl();
    console.log('Fetching about content from:', url);
    
    return this.http.get<string>(url).pipe(
      tap(content => {
        console.log('About content fetched successfully for user:', this.authService.currentUsername);
        console.log('Content received:', content);
      }),
      catchError(error => {
        console.error('Error fetching about content:', error);
        // Return default content in case of error
        return of(this.defaultContent);
      })
    );
  }

  /**
   * Saves the about content to Firebase under the current user
   * @param content The content to save
   * @returns Observable with the save operation result
   */
  saveAboutContent(content: string): Observable<any> {
    const url = this.getUserAboutUrl();
    console.log('Saving about content to:', url);
    console.log('Content to save:', content);
    
    return this.http.put(url, JSON.stringify(content)).pipe(
      tap(response => {
        console.log('About content saved successfully for user:', this.authService.currentUsername);
        console.log('Firebase response:', response);
      }),
      catchError(error => {
        console.error('Error saving about content:', error);
        console.error('Error details:', JSON.stringify(error));
        throw error;
      })
    );
  }

  /**
   * Gets the default about content
   * @returns The default about content
   */
  getDefaultContent(): string {
    return this.defaultContent;
  }
}
