import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';

describe('WorkoutService', () => {
  let service: WorkoutService;

  beforeEach(() => {
    // Clear localStorage before each test to avoid state pollution
    localStorage.clear();

    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a workout for a new user', () => {
    const username = 'John Doe';
    const workout = { type: 'Running', minutes: 30 };

    service.addWorkout(username, workout);

    const users = service.getUsers();
    expect(users.length).toBe(1);
    expect(users[0].name).toBe(username);
    expect(users[0].workouts.length).toBe(1);
    expect(users[0].workouts[0]).toEqual(workout);
  });

  it('should add a workout to an existing user', () => {
    const username = 'Jane Doe';
    const workout1 = { type: 'Cycling', minutes: 45 };
    const workout2 = { type: 'Yoga', minutes: 60 };

    // Add first workout
    service.addWorkout(username, workout1);
    // Add second workout
    service.addWorkout(username, workout2);

    const users = service.getUsers();
    expect(users.length).toBe(1);
    expect(users[0].name).toBe(username);
    expect(users[0].workouts.length).toBe(2);
    expect(users[0].workouts).toContain(workout1);
    expect(users[0].workouts).toContain(workout2);
  });

  it('should handle multiple users correctly', () => {
    const user1 = 'Alice';
    const user2 = 'Bob';
    const workout1 = { type: 'Swimming', minutes: 40 };
    const workout2 = { type: 'Weightlifting', minutes: 50 };

    service.addWorkout(user1, workout1);
    service.addWorkout(user2, workout2);

    const users = service.getUsers();
    expect(users.length).toBe(2);

    const user1Record = users.find(user => user.name === user1);
    expect(user1Record).toBeDefined();
    expect(user1Record?.workouts.length).toBe(1);
    expect(user1Record?.workouts[0]).toEqual(workout1);

    const user2Record = users.find(user => user.name === user2);
    expect(user2Record).toBeDefined();
    expect(user2Record?.workouts.length).toBe(1);
    expect(user2Record?.workouts[0]).toEqual(workout2);
  });

  it('should update user data correctly in localStorage', () => {
    const username = 'John Smith';
    const workout = { type: 'Running', minutes: 20 };

    service.addWorkout(username, workout);

    // Ensure data is in localStorage
    const storedData = localStorage.getItem('userData');
    expect(storedData).not.toBeNull();
    const users = JSON.parse(storedData || '[]');
    expect(users.length).toBe(1);
    expect(users[0].name).toBe(username);
    expect(users[0].workouts.length).toBe(1);
    expect(users[0].workouts[0]).toEqual(workout);
  });
});
