import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AboutService {
  private firebaseUrl = 'https://angulartest-93e44-default-rtdb.asia-southeast1.firebasedatabase.app/about.json';
  private defaultContent = 'I am a MCA student passionate about software development, constantly enhancing my knowledge in coding, logical thinking, and problem-solving. I actively engage in hands-on projects, exploring various technologies to deepen my understanding of programming concepts. My approach to work is a blend of dedication and smart thinking, allowing me to efficiently tackle challenges and complete tasks within deadlines.';

  constructor(private http: HttpClient) {}

  /**
   * Fetches the about content from Firebase
   * @returns Observable with the about content
   */
  getAboutContent(): Observable<string> {
    return this.http.get<string>(this.firebaseUrl).pipe(
      tap(content => console.log('About content fetched successfully')),
      catchError(error => {
        console.error('Error fetching about content:', error);
        // Return default content in case of error
        return of(this.defaultContent);
      })
    );
  }

  /**
   * Saves the about content to Firebase
   * @param content The content to save
   * @returns Observable with the save operation result
   */
  saveAboutContent(content: string): Observable<any> {
    return this.http.put(this.firebaseUrl, content).pipe(
      tap(() => console.log('About content saved successfully')),
      catchError(error => {
        console.error('Error saving about content:', error);
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
