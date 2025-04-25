const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Client = require('../models/Client');
const Goal = require('../models/Goal');
const CheckIn = require('../models/CheckIn');
const DietPlan = require('../models/DietPlan');
const WorkoutPlan = require('../models/WorkoutPlan');
const ProgressEntry = require('../models/ProgressEntry');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Sample data for seeding
const seedData = async () => {
  try {
    // Clear existing data
    await Client.deleteMany({});
    await Goal.deleteMany({});
    await CheckIn.deleteMany({});
    await DietPlan.deleteMany({});
    await WorkoutPlan.deleteMany({});
    await ProgressEntry.deleteMany({});

    console.log('Previous data cleared');

    // Create clients
    const clientsData = [
      {
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
        notes: "Alex is highly motivated and consistent with workouts."
      },
      {
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah.williams@example.com",
        phone: "555-987-6543",
        dateOfBirth: new Date("1992-03-20"),
        joinDate: new Date("2023-02-15"),
        gender: "female",
        height: 165, // cm
        currentWeight: 62, // kg
        initialWeight: 68, // kg
        notes: "Sarah is focused on toning and improving endurance."
      }
    ];

    const clients = await Client.insertMany(clientsData);
    console.log(`${clients.length} clients created`);

    // Create goals
    const goalsData = [
      {
        clientId: clients[0]._id,
        type: "WEIGHT_LOSS",
        description: "Lose 15kg and improve overall fitness",
        targetDate: new Date("2023-07-10"),
        status: "IN_PROGRESS",
        progress: 65,
        startValue: 95,
        currentValue: 85,
        targetValue: 80,
        unit: "kg"
      },
      {
        clientId: clients[1]._id,
        type: "MUSCLE_GAIN",
        description: "Increase strength and muscle definition",
        targetDate: new Date("2023-08-20"),
        status: "IN_PROGRESS",
        progress: 40,
        startValue: 20,
        currentValue: 25,
        targetValue: 30,
        unit: "strength index"
      }
    ];

    const goals = await Goal.insertMany(goalsData);
    console.log(`${goals.length} goals created`);

    // Create check-ins
    const now = new Date();
    const checkInsData = [
      {
        clientId: clients[0]._id,
        date: new Date(now.setDate(now.getDate() + 7)),
        status: "scheduled",
        notes: "Weekly progress review",
        duration: 30
      },
      {
        clientId: clients[1]._id,
        date: new Date(now.setDate(now.getDate() + 3)),
        status: "scheduled",
        notes: "Monthly measurements and program adjustment",
        duration: 45
      }
    ];

    const checkIns = await CheckIn.insertMany(checkInsData);
    console.log(`${checkIns.length} check-ins created`);

    // Update clients with nextCheckIn date
    await Client.findByIdAndUpdate(clients[0]._id, { nextCheckIn: checkInsData[0].date });
    await Client.findByIdAndUpdate(clients[1]._id, { nextCheckIn: checkInsData[1].date });

    // Create diet plans
    const dietPlansData = [
      {
        clientId: clients[0]._id,
        name: "Calorie Deficit Plan",
        description: "Balanced diet with calorie deficit to promote weight loss",
        dailyCalories: 2000,
        macros: {
          protein: 40,
          carbs: 30,
          fats: 30
        },
        meals: [
          {
            name: "Breakfast",
            description: "Protein oatmeal with berries",
            calories: 400
          },
          {
            name: "Lunch",
            description: "Grilled chicken salad with olive oil dressing",
            calories: 600
          },
          {
            name: "Dinner",
            description: "Baked salmon with steamed vegetables",
            calories: 700
          },
          {
            name: "Snack",
            description: "Greek yogurt with nuts",
            calories: 300
          }
        ]
      },
      {
        clientId: clients[1]._id,
        name: "Muscle Building Plan",
        description: "High protein diet to support muscle growth",
        dailyCalories: 2400,
        macros: {
          protein: 45,
          carbs: 35,
          fats: 20
        },
        meals: [
          {
            name: "Breakfast",
            description: "Protein smoothie with banana and almond butter",
            calories: 500
          },
          {
            name: "Lunch",
            description: "Turkey wrap with whole grain tortilla",
            calories: 650
          },
          {
            name: "Dinner",
            description: "Lean beef stir fry with brown rice",
            calories: 750
          },
          {
            name: "Snack",
            description: "Protein bar and apple",
            calories: 350
          },
          {
            name: "Post-Workout",
            description: "Protein shake with 25g protein",
            calories: 150
          }
        ]
      }
    ];

    const dietPlans = await DietPlan.insertMany(dietPlansData);
    console.log(`${dietPlans.length} diet plans created`);

    // Create workout plans
    const workoutPlansData = [
      {
        clientId: clients[0]._id,
        name: "Fat Loss Circuit Program",
        description: "Combination of cardio and strength training to maximize fat loss",
        frequency: 4,
        exercises: [
          {
            name: "Squats",
            sets: 4,
            reps: 15,
            weight: 30
          },
          {
            name: "Push-ups",
            sets: 3,
            reps: 12,
            weight: 0
          },
          {
            name: "Kettlebell swings",
            sets: 3,
            reps: 20,
            weight: 16
          },
          {
            name: "Plank",
            sets: 3,
            reps: "60 sec",
            weight: 0
          }
        ]
      },
      {
        clientId: clients[1]._id,
        name: "Strength Building Program",
        description: "Progressive overload strength training with compound movements",
        frequency: 5,
        exercises: [
          {
            name: "Deadlifts",
            sets: 5,
            reps: 5,
            weight: 60
          },
          {
            name: "Bench Press",
            sets: 4,
            reps: 8,
            weight: 40
          },
          {
            name: "Pull-ups",
            sets: 3,
            reps: 10,
            weight: 0
          },
          {
            name: "Shoulder Press",
            sets: 3,
            reps: 10,
            weight: 25
          }
        ]
      }
    ];

    const workoutPlans = await WorkoutPlan.insertMany(workoutPlansData);
    console.log(`${workoutPlans.length} workout plans created`);

    // Create progress entries
    const progressEntriesData = [];
    
    // For client 1
    const startDate1 = new Date("2023-01-15");
    for (let i = 0; i < 10; i++) {
      const entryDate = new Date(startDate1);
      entryDate.setDate(entryDate.getDate() + (i * 14)); // Every 2 weeks
      
      progressEntriesData.push({
        clientId: clients[0]._id,
        date: entryDate,
        weight: 95 - (i * 1), // Progressive weight loss
        bodyFat: 24 - (i * 0.5),
        measurements: {
          waist: 95 - (i * 0.8),
          chest: 105 - (i * 0.3)
        },
        notes: `Bi-weekly check-in ${i+1}`
      });
    }
    
    // For client 2
    const startDate2 = new Date("2023-02-20");
    for (let i = 0; i < 8; i++) {
      const entryDate = new Date(startDate2);
      entryDate.setDate(entryDate.getDate() + (i * 14)); // Every 2 weeks
      
      progressEntriesData.push({
        clientId: clients[1]._id,
        date: entryDate,
        weight: 68 - (i * 0.8), // Progressive weight change
        bodyFat: 28 - (i * 0.6),
        measurements: {
          waist: 78 - (i * 0.5),
          chest: 88 + (i * 0.2)
        },
        notes: `Bi-weekly check-in ${i+1}`
      });
    }

    const progressEntries = await ProgressEntry.insertMany(progressEntriesData);
    console.log(`${progressEntries.length} progress entries created`);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
