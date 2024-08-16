import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserWorkoutTableComponent } from './user-workout-table.component';
import { WorkoutService } from '../workout.service';

describe('UserWorkoutTableComponent', () => {
  let component: UserWorkoutTableComponent;
  let fixture: ComponentFixture<UserWorkoutTableComponent>;
  let workoutService: WorkoutService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserWorkoutTableComponent],
      providers: [
        {
          provide: WorkoutService,
          useValue: {
            users$: of([
              {
                id: 1,
                name: 'John Doe',
                workouts: [
                  { type: 'Running', minutes: 30 },
                  { type: 'Cycling', minutes: 45 }
                ]
              },
              {
                id: 2,
                name: 'Jane Doe',
                workouts: [
                  { type: 'Swimming', minutes: 60 },
                  { type: 'Yoga', minutes: 30 }
                ]
              }
            ])
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserWorkoutTableComponent);
    component = fixture.componentInstance;
    workoutService = TestBed.inject(WorkoutService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter workouts based on search term', () => {
    component.searchTerm = 'Jane';
    component.filterWorkouts();
    expect(component.filteredWorkouts.length).toBe(1);
    expect(component.filteredWorkouts[0].name).toBe('Jane Doe');
  });

  it('should filter workouts based on selected filter', () => {
    component.selectedFilter = 'Swimming';
    component.filterWorkouts();
    expect(component.filteredWorkouts.length).toBe(1);
    expect(component.filteredWorkouts[0].workouts.some(workout => workout.type === 'Swimming')).toBe(true);
  });

  it('should paginate workouts correctly', () => {
    component.rowsPerPage = 1;
    component.currentPage = 1;
    component.filterWorkouts();
    component.paginatedWorkouts = component.getPaginatedWorkouts();
    expect(component.paginatedWorkouts.length).toBe(1);
    expect(component.paginatedWorkouts[0].name).toBe('John Doe');
  });

  it('should handle next page functionality', () => {
    component.rowsPerPage = 1;
    component.currentPage = 1;
    component.filterWorkouts();
    component.onNextPage();
    expect(component.currentPage).toBe(2);
    expect(component.paginatedWorkouts.length).toBe(1);
    expect(component.paginatedWorkouts[0].name).toBe('Jane Doe');
  });

  it('should handle previous page functionality', () => {
    component.rowsPerPage = 1;
    component.currentPage = 2;
    component.filterWorkouts();
    component.onPreviousPage();
    expect(component.currentPage).toBe(1);
    expect(component.paginatedWorkouts.length).toBe(1);
    expect(component.paginatedWorkouts[0].name).toBe('John Doe');
  });

  it('should calculate total minutes correctly', () => {
    const workouts = [
      { type: 'Running', minutes: 30 },
      { type: 'Cycling', minutes: 45 }
    ];
    expect(component.getTotalMinutes(workouts)).toBe(75);
  });

  it('should calculate number of workouts correctly', () => {
    const workouts = [
      { type: 'Running', minutes: 30 },
      { type: 'Cycling', minutes: 45 }
    ];
    expect(component.getNumberOfWorkouts(workouts)).toBe(2);
  });

  // New test cases

  it('should filter workouts when onSearch is called', () => {
    spyOn(component, 'filterWorkouts'); // Spy on the filterWorkouts method
    component.onSearch();
    expect(component.filterWorkouts).toHaveBeenCalled();
  });

  it('should filter workouts when onFilterChange is called', () => {
    spyOn(component, 'filterWorkouts'); // Spy on the filterWorkouts method
    component.onFilterChange();
    expect(component.filterWorkouts).toHaveBeenCalled();
  });

  it('should reset to the first page and paginate workouts when onRowsPerPageChange is called', () => {
    spyOn(component, 'getPaginatedWorkouts').and.callThrough(); // Spy on getPaginatedWorkouts method
    component.rowsPerPage = 1;
    component.currentPage = 3; // Simulate user being on the 3rd page
    component.onRowsPerPageChange();
    
    expect(component.currentPage).toBe(1); // Expect to reset to the first page
    expect(component.getPaginatedWorkouts).toHaveBeenCalled();
  });

  it('should not change page if already on the first page when onPreviousPage is called', () => {
    component.currentPage = 1; // Simulate user being on the first page
    component.onPreviousPage();
    expect(component.currentPage).toBe(1); // Page should stay the same
  });

  it('should decrement the page and update paginated workouts if currentPage is greater than 1', () => {
    component.currentPage = 2; // Simulate user being on the second page
    spyOn(component, 'getPaginatedWorkouts').and.callThrough(); // Spy on the getPaginatedWorkouts method
    
    component.onPreviousPage(); // Call the method
    
    expect(component.currentPage).toBe(1); // Expect page to be decremented to 1
    expect(component.getPaginatedWorkouts).toHaveBeenCalled(); // Ensure paginated workouts are recalculated
  });
  
});
