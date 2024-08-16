import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private localStorageKey = 'userData';
  private usersSubject = new BehaviorSubject<Array<{ id: number; name: string; workouts: { type: string; minutes: number }[] }>>(this.getUsers());
  users$ = this.usersSubject.asObservable();

  constructor() {}

  // Function to add a workout to localStorage
  addWorkout(username: string, workout: { type: string; minutes: number }) {
    const users = this.getUsers();
    const user = users.find(u => u.name === username);

    if (user) {
      user.workouts.push(workout);
    } else {
      const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        name: username,
        workouts: [workout]
      };
      users.push(newUser);
    }

    localStorage.setItem(this.localStorageKey, JSON.stringify(users));
    this.usersSubject.next(users);  // Emit the updated list
  }

  // Function to retrieve all users from localStorage
  getUsers(): Array<{ id: number; name: string; workouts: { type: string; minutes: number }[] }> {
    const users = localStorage.getItem(this.localStorageKey);
    return users ? JSON.parse(users) : [];
  }
}
