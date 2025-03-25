# PortfolioInAng

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

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

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
