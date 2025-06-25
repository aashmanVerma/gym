export interface Workout {
  id: number;
  title: string;
  category: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  calories: string;
  rating: number;
  instructor: string;
  thumbnail: string;
  tags: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  memberSince: string;
  currentStreak: number;
  totalWorkouts: number;
  favoriteWorkout: string;
  fitnessLevel: string;
  goals: string[];
  avatar: string;
}

export interface Activity {
  workout: string;
  date: string;
  duration: string;
  calories: string;
}