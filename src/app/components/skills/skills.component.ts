import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SkillsService, SkillCategory } from '../../services/skills.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit, OnDestroy {
  skillCategories: SkillCategory[] = [];
  isEditing = false;
  isLoading = true;
  error = '';
  isAdmin = false;
  currentUsername = '';
  newSkill = '';
  private authSubscription: Subscription | null = null;
  private usernameSubscription: Subscription | null = null;

  constructor(public authService: AuthService, private skillsService: SkillsService) {
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
        this.loadSkillsData();
      }
    });

    // Subscribe to username changes
    this.usernameSubscription = this.authService.currentUsername$.subscribe(username => {
      console.log('Username changed:', username);
      this.currentUsername = username;
      // Reload content when username changes
      if (username) {
        this.loadSkillsData();
      }
    });

    // Initial content load
    this.loadSkillsData();
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

  loadSkillsData() {
    this.isLoading = true;
    this.error = '';
    // Fetch from Firebase using the SkillsService
    this.skillsService.getSkillsData().subscribe(
      (data: SkillCategory[]) => {
        this.isLoading = false;
        if (data && data.length > 0) {
          this.skillCategories = data;
        } else {
          // If no data in Firebase, use default content
          this.skillCategories = this.skillsService.getDefaultSkills();
          // Save default content to Firebase if user is logged in
          if (this.currentUsername) {
            this.saveSkillsData();
          }
        }
      },
      (error) => {
        this.isLoading = false;
        this.error = 'Error loading skills data. Please try again later.';
        console.error('Error fetching skills data:', error);
        // If error, use default content
        this.skillCategories = this.skillsService.getDefaultSkills();
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
    this.saveSkillsData();
  }

  cancelEditing() {
    this.isEditing = false;
    // Reload the data to discard changes
    this.loadSkillsData();
  }

  addCategory() {
    this.skillCategories.push({
      name: '',
      skills: []
    });
  }

  removeCategory(index: number) {
    this.skillCategories.splice(index, 1);
  }

  addSkill(categoryIndex: number) {
    if (this.newSkill.trim()) {
      this.skillCategories[categoryIndex].skills.push(this.newSkill.trim());
      this.newSkill = '';
    }
  }

  removeSkill(categoryIndex: number, skillIndex: number) {
    this.skillCategories[categoryIndex].skills.splice(skillIndex, 1);
  }

  private saveSkillsData() {
    this.skillsService.saveSkillsData(this.skillCategories).subscribe(
      () => {
        this.isLoading = false;
        console.log('Skills data saved successfully');
      },
      (error) => {
        this.isLoading = false;
        this.error = 'Error saving skills data. Please try again later.';
        console.error('Error saving skills data:', error);
      }
    );
  }
}
