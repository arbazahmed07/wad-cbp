
import { Client, GoalStatus, GoalType } from "@/types";

export const mockClients: Client[] = [
  {
    id: "1",
    firstName: "Alex",
    lastName: "Johnson",
    email: "alex.johnson@example.com",
    phone: "555-123-4567",
    dateOfBirth: new Date("1990-05-15"),
    joinDate: new Date("2023-01-10"),
    gender: "male",
    height: 180, // cm
    currentWeight: 85, // kg
    initialWeight: 95, // kg
    goals: [
      {
        id: "g1",
        clientId: "1",
        type: GoalType.WEIGHT_LOSS,
        description: "Lose 15kg and improve overall fitness",
        targetDate: new Date("2023-07-10"),
        status: GoalStatus.IN_PROGRESS,
        progress: 65,
        startValue: 95,
        currentValue: 85,
        targetValue: 80,
        unit: "kg"
      }
    ],
    progressEntries: [
      {
        id: "p1",
        clientId: "1",
        date: new Date("2023-01-15"),
        weight: 95,
        bodyFat: 28,
        notes: "Initial assessment",
        measurements: {
          chest: 105,
          waist: 98,
          hips: 110,
          arms: 38,
          thighs: 65
        }
      },
      {
        id: "p2",
        clientId: "1",
        date: new Date("2023-02-15"),
        weight: 92,
        bodyFat: 26,
        notes: "Making good progress",
        measurements: {
          chest: 104,
          waist: 96,
          hips: 108,
          arms: 38,
          thighs: 64
        }
      },
      {
        id: "p3",
        clientId: "1",
        date: new Date("2023-03-15"),
        weight: 88,
        bodyFat: 25,
        notes: "Consistent progress, focusing on strength training now",
        measurements: {
          chest: 103,
          waist: 92,
          hips: 105,
          arms: 39,
          thighs: 62
        }
      },
      {
        id: "p4",
        clientId: "1",
        date: new Date("2023-04-15"),
        weight: 85,
        bodyFat: 23,
        notes: "Energy levels improving, sleep quality better",
        measurements: {
          chest: 102,
          waist: 89,
          hips: 102,
          arms: 40,
          thighs: 60
        }
      }
    ],
    notes: "Alex is very motivated but needs guidance on proper nutrition. Responds well to positive reinforcement.",
    dietPlan: {
      id: "d1",
      name: "Low Carb Fat Loss",
      description: "Focus on protein and healthy fats with limited carbs",
      dailyCalories: 2200,
      macros: {
        protein: 40,
        carbs: 20,
        fats: 40
      },
      meals: [
        {
          name: "Breakfast",
          description: "Protein smoothie with berries and almond milk"
        },
        {
          name: "Lunch",
          description: "Grilled chicken salad with olive oil dressing"
        },
        {
          name: "Dinner",
          description: "Baked salmon with asparagus and quinoa"
        }
      ]
    },
    workoutPlan: {
      id: "w1",
      name: "Fat Loss Circuit Program",
      description: "High intensity circuit training with strength elements",
      frequency: 4,
      exercises: [
        {
          name: "Squats",
          sets: 4,
          reps: 12,
          weight: 70
        },
        {
          name: "Bench Press",
          sets: 3,
          reps: 10,
          weight: 60
        },
        {
          name: "Deadlifts",
          sets: 4,
          reps: 8,
          weight: 100
        }
      ]
    },
    nextCheckIn: new Date("2023-05-15")
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Miller",
    email: "sarah.miller@example.com",
    phone: "555-987-6543",
    dateOfBirth: new Date("1988-10-20"),
    joinDate: new Date("2022-11-05"),
    gender: "female",
    height: 165, // cm
    currentWeight: 62, // kg
    initialWeight: 60, // kg
    goals: [
      {
        id: "g2",
        clientId: "2",
        type: GoalType.MUSCLE_GAIN,
        description: "Build strength and add lean muscle mass",
        targetDate: new Date("2023-08-05"),
        status: GoalStatus.IN_PROGRESS,
        progress: 45,
        startValue: 60,
        currentValue: 62,
        targetValue: 65,
        unit: "kg"
      }
    ],
    progressEntries: [
      {
        id: "p5",
        clientId: "2",
        date: new Date("2022-11-10"),
        weight: 60,
        bodyFat: 22,
        notes: "Initial assessment - good baseline fitness",
        measurements: {
          chest: 88,
          waist: 70,
          hips: 92,
          arms: 28,
          thighs: 52
        }
      },
      {
        id: "p6",
        clientId: "2",
        date: new Date("2022-12-10"),
        weight: 61,
        bodyFat: 21.5,
        notes: "Starting to see muscle definition in arms and shoulders",
        measurements: {
          chest: 89,
          waist: 70,
          hips: 92,
          arms: 29,
          thighs: 53
        }
      },
      {
        id: "p7",
        clientId: "2",
        date: new Date("2023-01-10"),
        weight: 62,
        bodyFat: 21,
        notes: "Strength improving across all lifts",
        measurements: {
          chest: 90,
          waist: 70,
          hips: 92,
          arms: 30,
          thighs: 54
        }
      }
    ],
    notes: "Sarah is focused on gaining strength without bulking too much. Prefers morning workouts.",
    dietPlan: {
      id: "d2",
      name: "Clean Bulking Plan",
      description: "Moderate caloric surplus with focus on protein timing",
      dailyCalories: 2300,
      macros: {
        protein: 35,
        carbs: 45,
        fats: 20
      },
      meals: [
        {
          name: "Breakfast",
          description: "Oatmeal with whey protein and banana"
        },
        {
          name: "Lunch",
          description: "Turkey and sweet potato bowl with vegetables"
        },
        {
          name: "Dinner",
          description: "Lean beef stir fry with brown rice"
        }
      ]
    },
    workoutPlan: {
      id: "w2",
      name: "Hypertrophy Focus",
      description: "Progressive overload program targeting all major muscle groups",
      frequency: 5,
      exercises: [
        {
          name: "Barbell Rows",
          sets: 4,
          reps: 10,
          weight: 40
        },
        {
          name: "Overhead Press",
          sets: 3,
          reps: 8,
          weight: 30
        },
        {
          name: "Hip Thrusts",
          sets: 4,
          reps: 12,
          weight: 60
        }
      ]
    },
    nextCheckIn: new Date("2023-02-10")
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@example.com",
    phone: "555-456-7890",
    dateOfBirth: new Date("1992-03-08"),
    joinDate: new Date("2023-03-20"),
    gender: "male",
    height: 175, // cm
    currentWeight: 70, // kg
    initialWeight: 70, // kg
    goals: [
      {
        id: "g3",
        clientId: "3",
        type: GoalType.ENDURANCE,
        description: "Train for first half-marathon",
        targetDate: new Date("2023-10-15"),
        status: GoalStatus.IN_PROGRESS,
        progress: 30,
        unit: "km"
      }
    ],
    progressEntries: [
      {
        id: "p8",
        clientId: "3",
        date: new Date("2023-03-25"),
        weight: 70,
        bodyFat: 18,
        notes: "Initial assessment - good cardiovascular fitness already",
        measurements: {
          chest: 95,
          waist: 80,
          hips: 94,
          arms: 33,
          thighs: 55
        }
      },
      {
        id: "p9",
        clientId: "3",
        date: new Date("2023-04-25"),
        weight: 69,
        bodyFat: 17.5,
        notes: "Completed 5K in personal best time",
        measurements: {
          chest: 95,
          waist: 79,
          hips: 94,
          arms: 33,
          thighs: 55
        }
      }
    ],
    notes: "Michael is training for his first half-marathon. Need to focus on gradual distance increases and recovery.",
    dietPlan: {
      id: "d3",
      name: "Endurance Nutrition Plan",
      description: "Higher carb intake with focus on fueling workouts and recovery",
      dailyCalories: 2600,
      macros: {
        protein: 25,
        carbs: 55,
        fats: 20
      },
      meals: [
        {
          name: "Breakfast",
          description: "Overnight oats with fruit and nut butter"
        },
        {
          name: "Lunch",
          description: "Whole grain pasta with chicken and vegetables"
        },
        {
          name: "Dinner",
          description: "Fish with roasted vegetables and quinoa"
        }
      ]
    },
    workoutPlan: {
      id: "w3",
      name: "Half-Marathon Training",
      description: "Progressive running program with strength conditioning",
      frequency: 4,
      exercises: [
        {
          name: "Long Run",
          sets: 1,
          reps: 1
        },
        {
          name: "Interval Training",
          sets: 6,
          reps: 400
        },
        {
          name: "Tempo Run",
          sets: 1,
          reps: 1
        }
      ]
    },
    nextCheckIn: new Date("2023-05-25")
  },
  {
    id: "4",
    firstName: "Jessica",
    lastName: "Williams",
    email: "jessica.williams@example.com",
    phone: "555-222-3333",
    dateOfBirth: new Date("1985-11-12"),
    joinDate: new Date("2023-02-01"),
    gender: "female",
    height: 170, // cm
    currentWeight: 75, // kg
    initialWeight: 82, // kg
    goals: [
      {
        id: "g4",
        clientId: "4",
        type: GoalType.WEIGHT_LOSS,
        description: "Lose weight and tone up for wedding",
        targetDate: new Date("2023-08-15"),
        status: GoalStatus.IN_PROGRESS,
        progress: 70,
        startValue: 82,
        currentValue: 75,
        targetValue: 68,
        unit: "kg"
      }
    ],
    progressEntries: [
      {
        id: "p10",
        clientId: "4",
        date: new Date("2023-02-05"),
        weight: 82,
        bodyFat: 30,
        notes: "Initial assessment",
        measurements: {
          chest: 98,
          waist: 85,
          hips: 102,
          arms: 34,
          thighs: 60
        }
      },
      {
        id: "p11",
        clientId: "4",
        date: new Date("2023-03-05"),
        weight: 79,
        bodyFat: 28,
        notes: "Good progress in first month",
        measurements: {
          chest: 96,
          waist: 83,
          hips: 100,
          arms: 33,
          thighs: 58
        }
      },
      {
        id: "p12",
        clientId: "4",
        date: new Date("2023-04-05"),
        weight: 75,
        bodyFat: 26,
        notes: "Consistent progress, clothes fitting better",
        measurements: {
          chest: 94,
          waist: 79,
          hips: 97,
          arms: 32,
          thighs: 56
        }
      }
    ],
    notes: "Jessica is preparing for her wedding in August. Highly motivated but needs encouragement during plateaus.",
    dietPlan: {
      id: "d4",
      name: "Wedding Prep Plan",
      description: "Balanced deficit with focus on satiety and nutrition",
      dailyCalories: 1800,
      macros: {
        protein: 35,
        carbs: 35,
        fats: 30
      },
      meals: [
        {
          name: "Breakfast",
          description: "Greek yogurt with berries and granola"
        },
        {
          name: "Lunch",
          description: "Mediterranean salad with grilled chicken"
        },
        {
          name: "Dinner",
          description: "Zucchini noodles with turkey meatballs"
        }
      ]
    },
    workoutPlan: {
      id: "w4",
      name: "Bridal Bootcamp",
      description: "Full body toning with cardio acceleration",
      frequency: 4,
      exercises: [
        {
          name: "Walking Lunges",
          sets: 3,
          reps: 20
        },
        {
          name: "Push-ups",
          sets: 3,
          reps: 15
        },
        {
          name: "HIIT Cardio",
          sets: 1,
          reps: 20
        }
      ]
    },
    nextCheckIn: new Date("2023-05-05")
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Garcia",
    email: "david.garcia@example.com",
    phone: "555-789-0123",
    dateOfBirth: new Date("1978-07-23"),
    joinDate: new Date("2022-10-10"),
    gender: "male",
    height: 178, // cm
    currentWeight: 88, // kg
    initialWeight: 94, // kg
    goals: [
      {
        id: "g5",
        clientId: "5",
        type: GoalType.GENERAL_FITNESS,
        description: "Improve overall health and reduce blood pressure",
        targetDate: new Date("2023-06-10"),
        status: GoalStatus.IN_PROGRESS,
        progress: 60
      }
    ],
    progressEntries: [
      {
        id: "p13",
        clientId: "5",
        date: new Date("2022-10-15"),
        weight: 94,
        bodyFat: 29,
        notes: "Initial assessment, BP: 145/95",
        measurements: {
          chest: 110,
          waist: 102,
          hips: 105,
          arms: 37,
          thighs: 60
        }
      },
      {
        id: "p14",
        clientId: "5",
        date: new Date("2022-12-15"),
        weight: 91,
        bodyFat: 27,
        notes: "BP improved to 140/90, energy improving",
        measurements: {
          chest: 108,
          waist: 99,
          hips: 104,
          arms: 37,
          thighs: 59
        }
      },
      {
        id: "p15",
        clientId: "5",
        date: new Date("2023-02-15"),
        weight: 88,
        bodyFat: 25,
        notes: "BP now 135/85, consistently attending 3x weekly",
        measurements: {
          chest: 106,
          waist: 96,
          hips: 102,
          arms: 38,
          thighs: 58
        }
      }
    ],
    notes: "David is focused on improving his health after doctor's recommendation. Has history of high blood pressure.",
    dietPlan: {
      id: "d5",
      name: "Heart Health Focus",
      description: "DASH-inspired plan with low sodium options",
      dailyCalories: 2100,
      macros: {
        protein: 25,
        carbs: 50,
        fats: 25
      },
      meals: [
        {
          name: "Breakfast",
          description: "Steel cut oats with cinnamon and apple"
        },
        {
          name: "Lunch",
          description: "Quinoa bowl with beans and vegetables"
        },
        {
          name: "Dinner",
          description: "Baked white fish with herbs and roasted vegetables"
        }
      ]
    },
    workoutPlan: {
      id: "w5",
      name: "Cardiac Health Program",
      description: "Combination of moderate cardio and strength training",
      frequency: 3,
      exercises: [
        {
          name: "Walking/Jogging",
          sets: 1,
          reps: 30
        },
        {
          name: "Resistance Band Work",
          sets: 3,
          reps: 15
        },
        {
          name: "Rowing Machine",
          sets: 3,
          reps: 5
        }
      ]
    },
    nextCheckIn: new Date("2023-04-15")
  }
];

export const goalTypeColors = {
  [GoalType.WEIGHT_LOSS]: "bg-red-500",
  [GoalType.MUSCLE_GAIN]: "bg-blue-500",
  [GoalType.ENDURANCE]: "bg-green-500",
  [GoalType.FLEXIBILITY]: "bg-yellow-500",
  [GoalType.GENERAL_FITNESS]: "bg-purple-500",
};

export const goalStatusColors = {
  [GoalStatus.NOT_STARTED]: "bg-gray-400",
  [GoalStatus.IN_PROGRESS]: "bg-blue-500",
  [GoalStatus.COMPLETED]: "bg-green-500",
};
