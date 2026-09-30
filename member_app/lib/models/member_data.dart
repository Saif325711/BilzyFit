class MemberData {
  const MemberData({
    required this.name,
    required this.memberId,
    required this.email,
    required this.membership,
    required this.expiryDate,
    required this.daysLeft,
    required this.visits,
    required this.weight,
    required this.height,
    required this.pendingAmount,
    this.secretCode = '749201',
    this.gymName = 'Star Fitness',
    this.branch = 'Star Fitness Center',
    this.gymAddress = 'Plot 18, Commercial Hub, Sector 62, Noida',
    this.gymPhone = '+91 98111 22334',
    this.gymTimings = '5:00 AM – 11:30 PM',
  });

  final String name;
  final String memberId;
  final String email;
  final String membership;
  final String expiryDate;
  final int daysLeft;
  final int visits;
  final double weight;
  final int height;
  final double pendingAmount;
  final String secretCode;
  final String gymName;
  final String branch;
  final String gymAddress;
  final String gymPhone;
  final String gymTimings;

  static const demo = MemberData(
    name: 'Rahul Sharma',
    memberId: 'GM1001',
    email: 'rahul.sharma@starfitness.com',
    membership: 'All Access VIP Pro',
    expiryDate: '30 Sep 2026',
    daysLeft: 23,
    visits: 18,
    weight: 74.5,
    height: 176,
    pendingAmount: 0,
    secretCode: '749201',
    gymName: 'Star Fitness',
    branch: 'Star Fitness Center',
    gymAddress: 'Plot 18, Commercial Hub, Sector 62, Noida',
    gymPhone: '+91 98111 22334',
    gymTimings: '5:00 AM – 11:30 PM',
  );
}

class WorkoutExercise {
  const WorkoutExercise(this.name, this.sets, this.reps);

  final String name;
  final int sets;
  final String reps;
}

class WorkoutPlan {
  const WorkoutPlan(this.name, this.description, this.exercises, {this.source = 'recommended'});

  final String name;
  final String description;
  final List<WorkoutExercise> exercises;
  final String source;
}

const workoutPlans = [
  WorkoutPlan(
    'Push day strength',
    'Chest, shoulders and triceps',
    [
      WorkoutExercise('Barbell Bench Press', 4, '10 reps'),
      WorkoutExercise('Incline Dumbbell Press', 3, '12 reps'),
      WorkoutExercise('Cable Chest Fly', 3, '15 reps'),
      WorkoutExercise('Tricep Rope Pushdown', 3, '12 reps'),
    ],
  ),
];

class Meal {
  const Meal(this.type, this.items, this.calories, {this.protein = 0, this.carbs = 0, this.fats = 0});

  final String type;
  final String items;
  final int calories;
  final int protein;
  final int carbs;
  final int fats;
}

class DietPlan {
  const DietPlan(this.name, this.description, this.meals, {this.source = 'recommended'});

  final String name;
  final String description;
  final List<Meal> meals;
  final String source;

  int get totalCalories => meals.fold(0, (sum, meal) => sum + meal.calories);
}

const dietPlans = [
  DietPlan(
    'Balanced muscle gain',
    'High protein meal plan',
    [
  Meal('Breakfast', 'Oats, eggs and seasonal fruit', 420),
  Meal('Lunch', 'Grilled chicken, rice and salad', 610),
  Meal('Snack', 'Greek yogurt and almonds', 240),
  Meal('Dinner', 'Paneer, vegetables and roti', 520),
    ],
  ),
];

class Payment {
  const Payment(this.amount, this.date, this.method);

  final double amount;
  final String date;
  final String method;
}

const paymentHistory = [
  Payment(2499, '01 Aug 2026', 'UPI'),
  Payment(2499, '01 Jul 2026', 'Card'),
  Payment(2499, '01 Jun 2026', 'UPI'),
];
