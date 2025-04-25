
export enum GoalStatus {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

export enum GoalType {
  WEIGHT_LOSS = "Weight Loss",
  MUSCLE_GAIN = "Muscle Gain",
  ENDURANCE = "Endurance",
  FLEXIBILITY = "Flexibility",
  GENERAL_FITNESS = "General Fitness",
}

export interface Goal {
  id: string;
  clientId: string;
  type: GoalType;
  description: string;
  targetDate: Date;
  status: GoalStatus;
  progress: number; // 0-100
  startValue?: number;
  currentValue?: number;
  targetValue?: number;
  unit?: string;
}

export interface ProgressEntry {
  id: string;
  clientId: string;
  date: Date;
  weight?: number;
  bodyFat?: number;
  notes: string;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
  };
}

export interface DietPlan {
  id: string;
  name: string;
  description: string;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: Array<{
    name: string;
    description: string;
  }>;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  frequency: number; // workouts per week
  exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    weight?: number;
  }>;
}

export interface CheckIn {
  id: string;
  clientId: string;
  clientName: string;
  date: Date;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
  duration: number; // minutes
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  joinDate: Date;
  gender: "male" | "female" | "other";
  height?: number;
  currentWeight?: number;
  initialWeight?: number;
  goals: Goal[];
  progressEntries: ProgressEntry[];
  notes: string;
  dietPlan?: DietPlan;
  workoutPlan?: WorkoutPlan;
  nextCheckIn?: Date;
  image?: string;
}
