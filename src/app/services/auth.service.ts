import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  public isAdmin$: Observable<boolean> = this.isAdminSubject.asObservable();
  private firebaseUrl = 'https://angulartest-93e44-default-rtdb.asia-southeast1.firebasedatabase.app';
  private usersUrl = `${this.firebaseUrl}/users.json`;

  constructor(private http: HttpClient) {
    // Clear any existing admin state to ensure fresh login is required
    localStorage.removeItem('isAdmin');
    this.isAdminSubject.next(false);
    
    // Uncomment below if you want to restore previous login state
    // const isLoggedIn = localStorage.getItem('isAdmin') === 'true';
    // if (isLoggedIn) {
    //   this.isAdminSubject.next(true);
    // }
  }

  signup(fullName: string, username: string, password: string): Observable<any> {
    // Since we can't use orderBy without proper indexing, let's fetch all users and filter manually
    return new Observable(observer => {
      this.http.get(this.usersUrl).subscribe(
        (users: any) => {
          // Check if username already exists
          const userExists = users ? Object.values(users).some((user: any) => 
            user.username === username
          ) : false;
          
          if (userExists) {
            // User already exists
            observer.error({ message: 'Username already exists' });
            observer.complete();
          } else {
            // Create new user
            const newUser = {
              fullName,
              username,
              password, // In a real app, this should be hashed
              isAdmin: true,
              createdAt: new Date().toISOString()
            };
            
            this.http.post(this.usersUrl, newUser).subscribe(
              (response) => {
                observer.next(response);
                observer.complete();
              },
              (error) => {
                observer.error(error);
                observer.complete();
              }
            );
          }
        },
        (error) => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  login(username: string, password: string): Observable<boolean> {
    return new Observable(observer => {
      this.http.get(this.usersUrl).subscribe(
        (users: any) => {
          if (users) {
            // Find user with matching username
            let foundUser = null;
            let userId = null;
            
            for (const id in users) {
              if (users[id].username === username) {
                foundUser = users[id];
                userId = id;
                break;
              }
            }
            
            if (foundUser && foundUser.password === password) {
              // Login successful
              this.isAdminSubject.next(true);
              localStorage.setItem('isAdmin', 'true');
              observer.next(true);
              observer.complete();
            } else {
              // Wrong password or user not found
              observer.next(false);
              observer.complete();
            }
          } else {
            // No users found
            observer.next(false);
            observer.complete();
          }
        },
        (error) => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  logout(): void {
    this.isAdminSubject.next(false);
    localStorage.removeItem('isAdmin');
  }

  get isAdmin(): boolean {
    return this.isAdminSubject.value;
  }
}
