import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface Project {
  title: string;
  techStack: string;
  description: string;
  githubLink?: string;
  demoLink?: string;
  date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private firebaseBaseUrl = environment.firebaseConfig.baseUrl;
  private defaultProjects: Project[] = [
    {
      title: 'Dry Fruits Management',
      techStack: 'C++ & SQL',
      description: 'Developed a management system for dry fruits inventory and transactions using C++ and SQL.',
      githubLink: 'https://github.com/sairam017/dryfruits',
      date: 'February 2024'
    },
    {
      title: '8-Puzzle Problem Solver',
      techStack: 'Python',
      description: 'Implemented an AI-based approach to solve the classic 8-puzzle problem using Python algorithms.',
      githubLink: 'https://github.com/yourusername/dry-fruits-management',
      date: 'May 2024'
    },
    {
      title: 'Dynamic Chess Game',
      techStack: 'Java',
      description: 'Created an interactive chess game with socket programming for multiplayer functionality.',
      date: 'August 2024'
    },
    {
      title: 'Employee Management System',
      techStack: 'PHP Typescript',
      description: 'Created with mono Login form for both Employee and Admin Department',
      date: 'December 2024'
    }
  ];

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Gets the Firebase URL for the current user's projects data
   * @returns The URL string for the current user's projects data
   */
  private getUserProjectsUrl(): string {
    const username = this.authService.currentUsername;
    console.log('Current username from AuthService:', username);
    
    if (!username) {
      console.warn('No username found, using default path');
      return `${this.firebaseBaseUrl}/projects.json`;
    }
    
    const url = `${this.firebaseBaseUrl}/users_data/${username}/projects.json`;
    console.log('Using Firebase URL:', url);
    return url;
  }

  /**
   * Fetches the projects data from Firebase for the current user
   * @returns Observable with the projects data
   */
  getProjectsData(): Observable<Project[]> {
    const url = this.getUserProjectsUrl();
    console.log('Fetching projects data from:', url);
    
    return this.http.get<Project[]>(url).pipe(
      tap(data => {
        console.log('Projects data fetched successfully for user:', this.authService.currentUsername);
        console.log('Data received:', data);
      }),
      catchError(error => {
        console.error('Error fetching projects data:', error);
        // Return default content in case of error
        return of(this.defaultProjects);
      })
    );
  }

  /**
   * Saves the projects data to Firebase under the current user
   * @param data The projects data to save
   * @returns Observable with the save operation result
   */
  saveProjectsData(data: Project[]): Observable<any> {
    const url = this.getUserProjectsUrl();
    console.log('Saving projects data to:', url);
    console.log('Data to save:', data);
    
    return this.http.put(url, data).pipe(
      tap(response => {
        console.log('Projects data saved successfully for user:', this.authService.currentUsername);
        console.log('Firebase response:', response);
      }),
      catchError(error => {
        console.error('Error saving projects data:', error);
        console.error('Error details:', JSON.stringify(error));
        throw error;
      })
    );
  }

  /**
   * Gets the default projects data
   * @returns The default projects data
   */
  getDefaultProjects(): Project[] {
    return this.defaultProjects;
  }
}
