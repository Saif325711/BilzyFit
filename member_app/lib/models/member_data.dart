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
    name: 'Saiful Islam',
    memberId: 'GM1001',
    email: 'saiful@example.com',
    membership: 'All Access VIP Pro',
    expiryDate: '30 Sep 2026',
    daysLeft: 23,
    visits: 18,
    weight: 78.0,
    height: 176,
    pendingAmount: 0,
    secretCode: '749201',
    gymName: 'Star Fitness',
    branch: 'Star Fitness Center',
    gymAddress: 'Plot 18, Commercial Hub, Sector 62, Noida',
    gymPhone: '+91 98111 22334',
    gymTimings: '5:00 AM – 11:30 PM',
  );

  factory MemberData.fromMap(Map<String, dynamic> map) {
    return MemberData(
      name: map['name'] as String? ?? 'Saiful Islam',
      memberId: map['memberId'] as String? ?? 'GM1001',
      email: map['email'] as String? ?? 'saiful@example.com',
      membership: map['membership'] as String? ?? 'All Access VIP Pro',
      expiryDate: map['expiryDate'] as String? ?? '30 Sep 2026',
      daysLeft: (map['daysLeft'] as num?)?.toInt() ?? 30,
      visits: (map['visits'] as num?)?.toInt() ?? 12,
      weight: (map['weight'] as num?)?.toDouble() ?? 78.0,
      height: (map['height'] as num?)?.toInt() ?? 175,
      pendingAmount: (map['pendingAmount'] as num?)?.toDouble() ?? 0.0,
      secretCode: map['secretCode'] as String? ?? '749201',
      gymName: map['gymName'] as String? ?? 'Star Fitness',
      branch: map['branch'] as String? ?? 'Star Fitness Center',
      gymAddress: map['gymAddress'] as String? ?? 'Plot 18, Commercial Hub, Sector 62, Noida',
      gymPhone: map['gymPhone'] as String? ?? '+91 98111 22334',
      gymTimings: map['gymTimings'] as String? ?? '5:00 AM – 11:30 PM',
    );
  }
}

class GoalData {
  GoalData({
    this.targetWeight = 72.0,
    this.currentWeight = 78.0,
    this.weeklyWorkoutsTarget = 5,
    this.weeklyWorkoutsDone = 4,
    this.dailyStepsTarget = 10000,
    this.dailyStepsDone = 8430,
    this.dailyCaloriesTarget = 500,
    this.dailyCaloriesBurned = 420,
    this.targetWeeks = 8,
  });

  double targetWeight;
  double currentWeight;
  int weeklyWorkoutsTarget;
  int weeklyWorkoutsDone;
  int dailyStepsTarget;
  int dailyStepsDone;
  int dailyCaloriesTarget;
  int dailyCaloriesBurned;
  int targetWeeks;

  double get workoutProgress =>
      (weeklyWorkoutsDone / (weeklyWorkoutsTarget > 0 ? weeklyWorkoutsTarget : 1))
          .clamp(0.0, 1.0);
  double get stepsProgress =>
      (dailyStepsDone / (dailyStepsTarget > 0 ? dailyStepsTarget : 1))
          .clamp(0.0, 1.0);
  double get caloriesProgress =>
      (dailyCaloriesBurned / (dailyCaloriesTarget > 0 ? dailyCaloriesTarget : 1))
          .clamp(0.0, 1.0);

  static final defaultGoal = GoalData();
}

class WorkoutExercise {
  const WorkoutExercise(this.name, this.sets, this.reps);

  final String name;
  final int sets;
  final String reps;
}

class WorkoutPlan {
  const WorkoutPlan(
    this.name,
    this.description,
    this.exercises, {
    this.duration = '30 min',
    this.level = 'Beginner',
    this.calories = '320',
    this.rating = '4.8',
    this.image = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
    this.category = 'Strength',
    this.isTrainerRecommended = false,
    this.trainerName = 'Coach Saiful',
    this.source = 'recommended',
  });

  final String name;
  final String description;
  final List<WorkoutExercise> exercises;
  final String duration;
  final String level;
  final String calories;
  final String rating;
  final String image;
  final String category;
  final bool isTrainerRecommended;
  final String trainerName;
  final String source;
}

const workoutPlans = [
  WorkoutPlan(
    'Push Day Strength',
    'Chest, shoulders and triceps hypertrophy workout curated by trainer.',
    [
      WorkoutExercise('Barbell Bench Press', 4, '10 reps'),
      WorkoutExercise('Incline Dumbbell Press', 3, '12 reps'),
      WorkoutExercise('Cable Chest Fly', 3, '15 reps'),
      WorkoutExercise('Tricep Rope Pushdown', 3, '12 reps'),
    ],
    duration: '35 min',
    level: 'Intermediate',
    calories: '340',
    rating: '4.9',
    category: 'Strength',
    isTrainerRecommended: true,
    trainerName: 'Trainer Saiful',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&auto=format&fit=crop&q=80',
  ),
  WorkoutPlan(
    'Trainer Pull & Back Pro',
    'Lats, rhomboids and biceps isolation protocol.',
    [
      WorkoutExercise('Lat Pulldowns', 4, '12 reps'),
      WorkoutExercise('Barbell Rows', 4, '10 reps'),
      WorkoutExercise('Seated Cable Row', 3, '12 reps'),
      WorkoutExercise('Hammer Curls', 3, '15 reps'),
    ],
    duration: '40 min',
    level: 'Advanced',
    calories: '380',
    rating: '5.0',
    category: 'Strength',
    isTrainerRecommended: true,
    trainerName: 'Trainer Rahul',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
  ),
  WorkoutPlan(
    'HIIT Cardio Fat Melter',
    'High intensity interval training for maximum stamina and burn.',
    [
      WorkoutExercise('Jump Rope Intervals', 4, '45 sec'),
      WorkoutExercise('Burpees', 3, '15 reps'),
      WorkoutExercise('Mountain Climbers', 4, '30 sec'),
      WorkoutExercise('Treadmill Sprints', 5, '1 min'),
    ],
    duration: '25 min',
    level: 'Beginner',
    calories: '310',
    rating: '4.7',
    category: 'Cardio',
    isTrainerRecommended: true,
    trainerName: 'Coach Saiful',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
  ),
  WorkoutPlan(
    'Leg Day Power',
    'Quadriceps, hamstrings and glutes builder.',
    [
      WorkoutExercise('Barbell Squats', 4, '8 reps'),
      WorkoutExercise('Leg Press', 3, '12 reps'),
      WorkoutExercise('Romanian Deadlift', 3, '10 reps'),
      WorkoutExercise('Calf Raises', 4, '20 reps'),
    ],
    duration: '35 min',
    level: 'Advanced',
    calories: '420',
    rating: '4.9',
    category: 'Strength',
    isTrainerRecommended: false,
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&auto=format&fit=crop&q=80',
  ),
];

class Meal {
  const Meal(
    this.type,
    this.items,
    this.calories, {
    this.protein = 0,
    this.carbs = 0,
    this.fats = 0,
    this.time = '08:00 AM',
    this.image = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80',
  });

  final String type;
  final String items;
  final int calories;
  final int protein;
  final int carbs;
  final int fats;
  final String time;
  final String image;
}

class DietPlan {
  const DietPlan(
    this.name,
    this.description,
    this.meals, {
    this.isTrainerRecommended = false,
    this.trainerName = 'Coach Saiful',
    this.targetCalories = 2200,
    this.targetGoal = 'Muscle Gain',
    this.source = 'recommended',
  });

  final String name;
  final String description;
  final List<Meal> meals;
  final bool isTrainerRecommended;
  final String trainerName;
  final int targetCalories;
  final String targetGoal;
  final String source;

  int get totalCalories => meals.fold(0, (sum, meal) => sum + meal.calories);
  int get totalProtein => meals.fold(0, (sum, meal) => sum + meal.protein);
  int get totalCarbs => meals.fold(0, (sum, meal) => sum + meal.carbs);
  int get totalFats => meals.fold(0, (sum, meal) => sum + meal.fats);
}

const dietPlans = [
  DietPlan(
    'High Protein Muscle Gain',
    'Trainer designed 2,200 kcal plan optimized for hypertrophy and lean mass.',
    [
      Meal(
        'Breakfast',
        'Oats with whey protein, eggs & banana',
        420,
        protein: 32,
        carbs: 55,
        fats: 10,
        time: '08:30 AM',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&auto=format&fit=crop&q=80',
      ),
      Meal(
        'Lunch',
        'Grilled chicken breast, brown rice & broccoli salad',
        610,
        protein: 48,
        carbs: 65,
        fats: 14,
        time: '01:00 PM',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80',
      ),
      Meal(
        'Post Workout',
        'Whey isolate shake & almonds',
        250,
        protein: 28,
        carbs: 12,
        fats: 8,
        time: '05:30 PM',
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&auto=format&fit=crop&q=80',
      ),
      Meal(
        'Dinner',
        'Grilled paneer / salmon with roasted veggies',
        520,
        protein: 38,
        carbs: 30,
        fats: 18,
        time: '08:30 PM',
        image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300&auto=format&fit=crop&q=80',
      ),
    ],
    isTrainerRecommended: true,
    trainerName: 'Nutritionist Saiful',
    targetCalories: 2200,
    targetGoal: 'Muscle Gain',
  ),
  DietPlan(
    'Lean Fat Cut & Shred',
    'Caloric deficit diet with high protein to retain muscle mass while dropping fat.',
    [
      Meal(
        'Breakfast',
        'Egg white omelette with spinach & avocado',
        320,
        protein: 26,
        carbs: 15,
        fats: 12,
        time: '08:00 AM',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&auto=format&fit=crop&q=80',
      ),
      Meal(
        'Lunch',
        'Chicken salad bowl with olive oil dressing',
        450,
        protein: 42,
        carbs: 20,
        fats: 15,
        time: '01:00 PM',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80',
      ),
      Meal(
        'Snack',
        'Green tea & unsalted almonds',
        180,
        protein: 6,
        carbs: 8,
        fats: 14,
        time: '04:30 PM',
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&auto=format&fit=crop&q=80',
      ),
      Meal(
        'Dinner',
        'Tofu & steamed broccoli bowl',
        380,
        protein: 30,
        carbs: 25,
        fats: 12,
        time: '08:00 PM',
        image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300&auto=format&fit=crop&q=80',
      ),
    ],
    isTrainerRecommended: true,
    trainerName: 'Coach Rahul',
    targetCalories: 1800,
    targetGoal: 'Weight Loss',
  ),
];

class Payment {
  const Payment(
    this.amount,
    this.date,
    this.method, {
    this.invoiceId = 'INV-2026-0801',
    this.status = 'Paid',
    this.planName = 'All Access VIP Pro',
    this.receiptPdf = 'Receipt_INV20260801.pdf',
  });

  final double amount;
  final String date;
  final String method;
  final String invoiceId;
  final String status;
  final String planName;
  final String receiptPdf;
}

const paymentHistory = [
  Payment(
    2499,
    '01 Aug 2026',
    'UPI (GPay)',
    invoiceId: 'INV-2026-0801',
    status: 'Paid',
    planName: 'All Access VIP Pro',
  ),
  Payment(
    2499,
    '01 Jul 2026',
    'Debit Card (HDFC)',
    invoiceId: 'INV-2026-0701',
    status: 'Paid',
    planName: 'All Access VIP Pro',
  ),
  Payment(
    2499,
    '01 Jun 2026',
    'UPI (PhonePe)',
    invoiceId: 'INV-2026-0601',
    status: 'Paid',
    planName: 'All Access VIP Pro',
  ),
];
