import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WorkoutService } from '../workout.service';

@Component({
  selector: 'app-add-workout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-workout.component.html',
  styleUrls: ['./add-workout.component.css']
})
export class AddWorkoutComponent {
  workoutForm: FormGroup;
  workouts: string[] = ['Swimming', 'Running', 'Cycling', 'Yoga', 'Weightlifting', 'Dancing'];

  constructor(private fb: FormBuilder, private workoutService: WorkoutService) {
    this.workoutForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      workout: ['', Validators.required],
      minutes: ['', [Validators.required, Validators.pattern('^[0-9]*$')]]
    });
  }

  onSubmit() {
    if (this.workoutForm.valid) {
      const workoutData = this.workoutForm.value;
      const workout = { type: workoutData.workout, minutes: parseInt(workoutData.minutes) };
      this.workoutService.addWorkout(workoutData.userName, workout);
      alert('Workout added successfully!');
      this.workoutForm.reset(); // Reset the form after successful submission
    } else {
      alert('Form is invalid!');
    }
  }
}
