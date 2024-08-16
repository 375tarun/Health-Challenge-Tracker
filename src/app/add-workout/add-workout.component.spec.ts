import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddWorkoutComponent } from './add-workout.component';
import { WorkoutService } from '../workout.service';
import { of } from 'rxjs';

// Mock the WorkoutService
class MockWorkoutService {
  addWorkout(userName: string, workout: { type: string, minutes: number }) {
    // Mock implementation
    return of(null); // Return an observable for the sake of example
  }
}

describe('AddWorkoutComponent', () => {
  let component: AddWorkoutComponent;
  let fixture: ComponentFixture<AddWorkoutComponent>;
  let workoutService: WorkoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddWorkoutComponent, ReactiveFormsModule, CommonModule],
      providers: [{ provide: WorkoutService, useClass: MockWorkoutService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AddWorkoutComponent);
    component = fixture.componentInstance;
    workoutService = TestBed.inject(WorkoutService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values and validators', () => {
    expect(component.workoutForm).toBeTruthy();
    expect(component.workoutForm.controls['userName'].value).toBe('');
    expect(component.workoutForm.controls['workout'].value).toBe('');
    expect(component.workoutForm.controls['minutes'].value).toBe('');
    expect(component.workoutForm.controls['userName'].hasError('required')).toBeTrue();
    expect(component.workoutForm.controls['workout'].hasError('required')).toBeTrue();
    expect(component.workoutForm.controls['minutes'].hasError('required')).toBeTrue();
  });

  it('should validate form inputs correctly', () => {
    component.workoutForm.controls['userName'].setValue('John');
    component.workoutForm.controls['workout'].setValue('Running');
    component.workoutForm.controls['minutes'].setValue('30');

    expect(component.workoutForm.valid).toBeTrue();
  });

  it('should handle form submission', () => {
    spyOn(workoutService, 'addWorkout').and.callThrough();
    component.workoutForm.controls['userName'].setValue('John Doe');
    component.workoutForm.controls['workout'].setValue('Running');
    component.workoutForm.controls['minutes'].setValue('30');
    
    component.onSubmit();

    expect(workoutService.addWorkout).toHaveBeenCalledWith('John Doe', { type: 'Running', minutes: 30 });
  });

  it('should reset the form after successful submission', () => {
    component.workoutForm.controls['userName'].setValue('John Doe');
    component.workoutForm.controls['workout'].setValue('Running');
    component.workoutForm.controls['minutes'].setValue('30');
    
    component.onSubmit();

    expect(component.workoutForm.controls['userName'].value).toBe(null);
    expect(component.workoutForm.controls['workout'].value).toBe(null);
    expect(component.workoutForm.controls['minutes'].value).toBe(null);
  });

  it('should not submit when form is invalid', () => {
    spyOn(workoutService, 'addWorkout');

    // Ensure the form is initially invalid (all fields empty)
    component.workoutForm.controls['userName'].setValue('');
    component.workoutForm.controls['workout'].setValue('');
    component.workoutForm.controls['minutes'].setValue('');

    component.onSubmit();

    // Ensure the form remains invalid and the service is not called
    expect(component.workoutForm.valid).toBeFalse();
    expect(workoutService.addWorkout).not.toHaveBeenCalled();
    expect(component.workoutForm.controls['userName'].hasError('required')).toBeTrue();
    expect(component.workoutForm.controls['workout'].hasError('required')).toBeTrue();
    expect(component.workoutForm.controls['minutes'].hasError('required')).toBeTrue();
  });

});
