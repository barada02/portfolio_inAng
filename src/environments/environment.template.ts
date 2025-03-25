/**
 * ENVIRONMENT CONFIGURATION TEMPLATE
 * 
 * This is a template file for setting up your own Firebase configuration.
 * Follow these steps to set up your environment:
 * 
 * 1. Copy this file and rename it to either:
 *    - environment.ts (for development)
 *    - environment.prod.ts (for production)
 * 
 * 2. Replace the Firebase baseUrl with your own Firebase Realtime Database URL
 *    You can find this in your Firebase project settings
 * 
 * 3. Make sure these files are added to .gitignore to keep your credentials secure
 *    The following lines should be in your .gitignore file:
 *    /src/environments/environment.ts
 *    /src/environments/environment.prod.ts
 * 
 * Note: This template file is committed to the repository to provide guidance,
 * but your actual environment files should never be committed.
 */

export const environment = {
  production: false, // Set to true for environment.prod.ts
  firebaseConfig: {
    // Replace this URL with your own Firebase Realtime Database URL
    baseUrl: 'https://your-firebase-project-id.firebasedatabase.app'
  }
};
