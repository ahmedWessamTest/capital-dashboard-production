import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService, User, UserResponse } from '../services/users/users.service'; // Adjust the path to your user.service

@Injectable({
  providedIn: 'root'
})
export class UserResolver implements Resolve<UserResponse | null> { // The resolver can return User or null
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserResponse | null> {
    const id = route.paramMap.get('id'); // Get the 'id' parameter from the URL

    if (id) {
      return this.userService.getById(+id).pipe(
        // Assuming your getById returns an ApiResponse<User>
        // and you want to extract the 'data' part of it
        // If getById directly returns User, then remove .pipe and map
        // map(response => response.data),
        catchError(error => {
          console.error('Error fetching user data:', error);
          // You can redirect to an error page or handle the error gracefully
          return of(null); // Return null if there's an error
        })
      );
    }
    
    // If no ID is present in the URL, return null
    return of(null);
  }
}