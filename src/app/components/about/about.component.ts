import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  aboutContent = '';
  isEditing = false;
  editableContent = '';
  firebaseUrl = 'https://angulartest-93e44-default-rtdb.asia-southeast1.firebasedatabase.app/about.json';
  isLoading = true;
  error = '';

  constructor(private http: HttpClient, public authService: AuthService) {}

  ngOnInit() {
    this.loadAboutContent();
  }

  loadAboutContent() {
    this.isLoading = true;
    this.error = '';
    // Fetch from Firebase
    this.http.get(this.firebaseUrl).subscribe(
      (data: any) => {
        this.isLoading = false;
        if (data) {
          this.aboutContent = data;
        } else {
          // If no data in Firebase, use default content
          this.aboutContent = 'I am a MCA student passionate about software development, constantly enhancing my knowledge in coding, logical thinking, and problem-solving. I actively engage in hands-on projects, exploring various technologies to deepen my understanding of programming concepts. My approach to work is a blend of dedication and smart thinking, allowing me to efficiently tackle challenges and complete tasks within deadlines.';
          // Save default content to Firebase
          this.saveAboutContent();
        }
      },
      (error) => {
        this.isLoading = false;
        this.error = 'Error loading content. Please try again later.';
        console.error('Error fetching about content:', error);
        // If error, use default content
        this.aboutContent = 'I am a MCA student passionate about software development, constantly enhancing my knowledge in coding, logical thinking, and problem-solving. I actively engage in hands-on projects, exploring various technologies to deepen my understanding of programming concepts. My approach to work is a blend of dedication and smart thinking, allowing me to efficiently tackle challenges and complete tasks within deadlines.';
      }
    );
  }

  enableEditing() {
    this.isEditing = true;
    this.editableContent = this.aboutContent;
  }

  saveChanges() {
    this.isLoading = true;
    this.aboutContent = this.editableContent;
    this.isEditing = false;
    this.saveAboutContent();
  }

  cancelEditing() {
    this.isEditing = false;
    this.editableContent = this.aboutContent;
  }

  private saveAboutContent() {
    this.http.put(this.firebaseUrl, this.aboutContent).subscribe(
      () => {
        this.isLoading = false;
        console.log('About content saved successfully');
      },
      (error) => {
        this.isLoading = false;
        this.error = 'Error saving content. Please try again later.';
        console.error('Error saving about content:', error);
      }
    );
  }
}
