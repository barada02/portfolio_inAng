import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="about-container">
      <h2>About Me</h2>
      <div class="about-content">
        <p>
          I'm a developer passionate about crafting accessible, pixel-perfect user interfaces 
          that blend thoughtful design with robust engineering. My favorite work lies at the 
          intersection of design and development, creating experiences that not only look great 
          but are meticulously built for performance and usability.
        </p>
        <p>
          Currently, I'm focused on building accessible, user-centered digital experiences 
          for various platforms.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 800px;
    }
    
    h2 {
      font-size: 2rem;
      margin-bottom: 2rem;
      color: #ccd6f6;
    }
    
    .about-content {
      color: #8892b0;
    }
    
    p {
      font-size: 1.1rem;
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }

    p:last-child {
      margin-bottom: 0;
    }
  `]
})
export class AboutComponent {}
