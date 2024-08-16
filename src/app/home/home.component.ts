import { Component} from '@angular/core';
import { AddWorkoutComponent } from '../add-workout/add-workout.component';
import { UserWorkoutTableComponent } from '../user-workout-table/user-workout-table.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ AddWorkoutComponent  , UserWorkoutTableComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
