# Angular Portfolio Application

![Angular](https://img.shields.io/badge/Angular-19.1.5-dd0031.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue.svg)
![Firebase](https://img.shields.io/badge/Firebase-Realtime_Database-orange.svg)

A modern, responsive portfolio application built with Angular that allows users to showcase their professional profile, skills, experience, education, projects, and contact information. The application features a clean design with a welcome screen and a detailed portfolio view.

## Features

- **Responsive Design**: Mobile-friendly layout that adapts to different screen sizes
- **Admin Authentication**: Secure login/signup system for content management
- **Editable Content**: All sections can be edited by authenticated admin users
- **Firebase Integration**: Real-time database for storing user-specific data
- **Component-Based Architecture**: Modular design for easy maintenance and scalability

## Screenshots

*[Add screenshots of your application here]*

## Getting Started

### Prerequisites

- Node.js (v16.x or later)
- npm (v8.x or later)
- Angular CLI (v19.x)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/portfolio_inAng.git
   cd portfolio_inAng
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment files (see [Environment Configuration](#environment-configuration))

4. Start the development server
   ```bash
   ng serve
   ```

5. Open your browser and navigate to `http://localhost:4200/`

## Environment Configuration

This project uses Firebase Realtime Database for storing and retrieving user-specific data. To set up your own environment:

1. **Create Environment Files**:
   - Look for `environment.template.ts` in the `src/environments/` directory
   - Copy this file to create two new files:
     - `environment.ts` (for development)
     - `environment.prod.ts` (for production)

2. **Configure Firebase**:
   - Replace the placeholder Firebase URL with your own Firebase Realtime Database URL
   - Example:
   ```typescript
   export const environment = {
     production: false, // Set to true for environment.prod.ts
     firebaseConfig: {
       baseUrl: 'https://your-firebase-project-id.firebasedatabase.app'
     }
   };
   ```

3. **Security Note**:
   - The environment files are already added to `.gitignore` to prevent exposing your Firebase URL
   - Never commit these files to version control

## Firebase Setup

To set up your own Firebase project:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Set up a Realtime Database
4. Copy the database URL for your environment files
5. Set up appropriate security rules for your database

### Recommended Database Rules

```json
{
  "rules": {
    "users": {
      ".read": true,
      ".write": true
    },
    "users_data": {
      "$uid": {
        ".read": true,
        ".write": "auth !== null"
      }
    }
  }
}
```

## Application Structure

The application is organized into these main sections:

- **About**: Personal bio and introduction
- **Experience**: Work history and professional experience
- **Education**: Academic background and qualifications
- **Skills**: Technical and professional skills organized by category
- **Projects**: Portfolio of completed projects with descriptions and links
- **Contact**: Contact information and social media links

Each section is editable by authenticated admin users, with changes stored in Firebase under user-specific paths.

## Admin Authentication

To access the admin features:

1. Click the "Admin" button in the sidebar
2. For first-time use, click "Need an account? Sign Up" to create an admin account
3. Enter your full name, username, and password
4. After signing up or logging in, you'll see edit buttons appear in each section

## Development

### Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running Tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Deployment

To deploy to production:

1. Update `environment.prod.ts` with your production Firebase URL
2. Build the application with the production configuration
   ```bash
   ng build --configuration production
   ```
3. Deploy the contents of the `dist/` directory to your hosting provider

## Documentation

For detailed technical documentation about the project architecture, data flow, and component breakdown, see the [DOCUMENTATION.md](./DOCUMENTATION.md) file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Angular Team for the amazing framework
- Firebase for the backend services
- Font Awesome for the icons

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
