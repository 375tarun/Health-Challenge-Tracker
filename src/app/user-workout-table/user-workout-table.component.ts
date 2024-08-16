import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../workout.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-workout-table',
  standalone: true,
  templateUrl: './user-workout-table.component.html',
  styleUrls: ['./user-workout-table.component.css'],
  imports: [CommonModule, FormsModule]
})
export class UserWorkoutTableComponent implements OnInit {
  searchTerm: string = '';
  selectedFilter: string = '';
  rowsPerPage: number = 5;
  currentPage: number = 1;

  userDataObservable$: Observable<Array<{ id: number; name: string; workouts: { type: string; minutes: number }[] }>>;
  userData : Array<{ id: number; name: string; workouts: { type: string; minutes: number }[] }> = [];
  filteredWorkouts: Array<{ id: number; name: string; workouts: { type: string; minutes: number }[] }> = [];
  paginatedWorkouts: Array<{ id: number; name: string; workouts: { type: string; minutes: number }[] }> = [];

  constructor(private workoutService: WorkoutService) {
    this.userDataObservable$ = this.workoutService.users$;
  }

  ngOnInit() {
    this.userDataObservable$.subscribe(users => {
      if(users.length !== 0){
        this.userData = users;
        this.filterWorkouts();
      }else{
        this.userData = this.workoutService.getUsers();
        this.filterWorkouts();
      }
    });
  }

  get totalPages(): number {
    return Math.ceil(this.filteredWorkouts.length / this.rowsPerPage);
  }

  onSearch() {
    this.filterWorkouts();
  }

  onFilterChange() {
    this.filterWorkouts();
  }

  filterWorkouts() {
    this.filteredWorkouts = this.userData.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesFilter = this.selectedFilter ? user.workouts.some(workout => workout.type === this.selectedFilter) : true;
      return matchesSearch && matchesFilter;
    });
    this.currentPage = 1; // Reset to the first page
    this.paginatedWorkouts = this.getPaginatedWorkouts();
  }

  getPaginatedWorkouts() {
    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    return this.filteredWorkouts.slice(startIndex, startIndex + this.rowsPerPage);
  }

  onRowsPerPageChange() {
    this.currentPage = 1; // Reset to the first page
    this.paginatedWorkouts = this.getPaginatedWorkouts();
  }

  onNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginatedWorkouts = this.getPaginatedWorkouts();
    }
  }

  onPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginatedWorkouts = this.getPaginatedWorkouts();
    }
  }

  getTotalMinutes(workouts: { type: string; minutes: number }[]): number {
    return workouts.reduce((total, workout) => total + workout.minutes, 0);
  }

  getNumberOfWorkouts(workouts: { type: string; minutes: number }[]): number {
    return workouts.length;
  }
}
