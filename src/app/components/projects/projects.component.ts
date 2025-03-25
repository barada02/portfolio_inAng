import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProjectsService, Project } from '../../services/projects.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  standalone: true
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  isEditing = false;
  isLoading = true;
  error = '';
  isAdmin = false;
  currentUsername = '';
  private authSubscription: Subscription | null = null;
  private usernameSubscription: Subscription | null = null;

  constructor(public authService: AuthService, private projectsService: ProjectsService) {
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
        this.loadProjectsData();
      }
    });

    // Subscribe to username changes
    this.usernameSubscription = this.authService.currentUsername$.subscribe(username => {
      console.log('Username changed:', username);
      this.currentUsername = username;
      // Reload content when username changes
      if (username) {
        this.loadProjectsData();
      }
    });

    // Initial content load
    this.loadProjectsData();
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

  loadProjectsData() {
    this.isLoading = true;
    this.error = '';
    // Fetch from Firebase using the ProjectsService
    this.projectsService.getProjectsData().subscribe(
      (data: Project[]) => {
        this.isLoading = false;
        if (data && data.length > 0) {
          this.projects = data;
        } else {
          // If no data in Firebase, use default content
          this.projects = this.projectsService.getDefaultProjects();
          // Save default content to Firebase if user is logged in
          if (this.currentUsername) {
            this.saveProjectsData();
          }
        }
      },
      (error) => {
        this.isLoading = false;
        this.error = 'Error loading projects data. Please try again later.';
        console.error('Error fetching projects data:', error);
        // If error, use default content
        this.projects = this.projectsService.getDefaultProjects();
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
    this.saveProjectsData();
  }

  cancelEditing() {
    this.isEditing = false;
    // Reload the data to discard changes
    this.loadProjectsData();
  }

  addProject() {
    this.projects.push({
      title: '',
      techStack: '',
      description: '',
      date: ''
    });
  }

  removeProject(index: number) {
    this.projects.splice(index, 1);
  }

  private saveProjectsData() {
    this.projectsService.saveProjectsData(this.projects).subscribe(
      () => {
        this.isLoading = false;
        console.log('Projects data saved successfully');
      },
      (error) => {
        this.isLoading = false;
        this.error = 'Error saving projects data. Please try again later.';
        console.error('Error saving projects data:', error);
      }
    );
  }
}
