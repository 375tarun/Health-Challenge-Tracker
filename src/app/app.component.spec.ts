import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    localStorage.clear(); // Clear localStorage before each test
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should have the title "healthchallengetracker"', () => {
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    expect(component.title).toEqual('healthchallengetracker');
  });

  it('should initialize userData in localStorage if not already present', () => {
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // Simulate ngOnInit
    component.ngOnInit();

    // Check localStorage
    const storedUserData = localStorage.getItem('userData');
    expect(storedUserData).toBeTruthy();

    // Verify the content of localStorage matches the initial userData
    expect(JSON.parse(storedUserData as string)).toEqual(component.userData);
  });

  it('should not overwrite userData in localStorage if already present', () => {
    const mockExistingUserData = [
      {
        id: 99,
        name: 'Existing User',
        workouts: [{ type: 'Walking', minutes: 15 }]
      }
    ];

    // Set mock data to localStorage
    localStorage.setItem('userData', JSON.stringify(mockExistingUserData));

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // Simulate ngOnInit
    component.ngOnInit();

    // Verify that existing data is not overwritten
    const storedUserData = localStorage.getItem('userData');
    expect(JSON.parse(storedUserData as string)).toEqual(mockExistingUserData);
  });

  it('should set initial data in localStorage if it is empty', () => {
    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // Simulate localStorage being empty
    localStorage.clear();

    // Simulate ngOnInit
    component.ngOnInit();

    // Check if the default userData is set in localStorage
    const storedUserData = localStorage.getItem('userData');
    expect(storedUserData).toBeTruthy();
    expect(JSON.parse(storedUserData as string)).toEqual(component.userData);
  });

  it('should retain localStorage data on ngOnInit when localStorage already contains userData', () => {
    const mockUserData = [
      {
        id: 1,
        name: 'Existing User',
        workouts: [{ type: 'Running', minutes: 30 }]
      }
    ];

    // Set some data in localStorage before ngOnInit
    localStorage.setItem('userData', JSON.stringify(mockUserData));

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // Simulate ngOnInit
    component.ngOnInit();

    // Check if the data in localStorage is not overwritten
    const storedUserData = localStorage.getItem('userData');
    expect(JSON.parse(storedUserData as string)).toEqual(mockUserData);
  });
});
