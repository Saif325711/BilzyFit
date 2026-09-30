import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_core/firebase_core.dart';
import '../models/member_data.dart';

class FirestoreService {
  FirestoreService._();
  static final FirestoreService instance = FirestoreService._();

  bool _isInitialized = false;
  bool get isInitialized => _isInitialized;

  FirebaseFirestore? _firestore;
  FirebaseFirestore get firestore => _firestore ?? FirebaseFirestore.instance;

  /// Initialize Firebase if not already initialized
  Future<bool> initialize({FirebaseOptions? options}) async {
    try {
      if (Firebase.apps.isEmpty) {
        if (options != null) {
          await Firebase.initializeApp(options: options);
        } else {
          // If native google-services.json / GoogleService-Info.plist exists
          await Firebase.initializeApp();
        }
      }
      _firestore = FirebaseFirestore.instance;
      _isInitialized = true;
      return true;
    } catch (e) {
      // Firebase not configured yet, fallback will be used
      _isInitialized = false;
      return false;
    }
  }

  /// Verify member credentials (Member ID + Secret Code) from Firestore
  Future<MemberData?> loginWithSecretCode({
    required String memberId,
    required String secretCode,
    String workspaceId = 'demo-workspace',
  }) async {
    if (!_isInitialized && Firebase.apps.isEmpty) {
      // Fallback: match against demo data
      if (secretCode == '749201' &&
          (memberId.toUpperCase() == 'GM1001' || memberId.toUpperCase() == 'M1001')) {
        return MemberData.demo;
      }
      return null;
    }

    try {
      final snapshot = await firestore
          .collection('workspaces/$workspaceId/members')
          .where('secretCode', isEqualTo: secretCode)
          .get();

      for (final doc in snapshot.docs) {
        final data = doc.data();
        final docMemberId = (data['memberId'] ?? doc.id).toString();
        if (docMemberId.toUpperCase() == memberId.toUpperCase() ||
            doc.id.toUpperCase() == memberId.toUpperCase()) {
          return _memberDataFromDoc(doc.id, data);
        }
      }
    } catch (e) {
      // If network error, fallback to demo if credentials match
      if (secretCode == '749201' &&
          (memberId.toUpperCase() == 'GM1001' || memberId.toUpperCase() == 'M1001')) {
        return MemberData.demo;
      }
    }
    return null;
  }

  /// Fetch member by email
  Future<Map<String, dynamic>?> getMemberByEmail(String email, {String workspaceId = 'demo-workspace'}) async {
    if (!_isInitialized && Firebase.apps.isEmpty) {
      return null;
    }
    try {
      final snapshot = await firestore
          .collection('workspaces/$workspaceId/members')
          .where('email', isEqualTo: email)
          .limit(1)
          .get();
      if (snapshot.docs.isNotEmpty) {
        return snapshot.docs.first.data();
      }
    } catch (_) {
      return null;
    }
    return null;
  }

  /// Real-time stream for member document updates
  Stream<MemberData?> streamMember({
    required String memberId,
    String workspaceId = 'demo-workspace',
  }) {
    if (!_isInitialized && Firebase.apps.isEmpty) {
      return Stream.value(MemberData.demo);
    }

    return firestore
        .collection('workspaces/$workspaceId/members')
        .doc(memberId)
        .snapshots()
        .map((doc) {
      if (!doc.exists || doc.data() == null) return null;
      return _memberDataFromDoc(doc.id, doc.data()!);
    }).handleError((_) => MemberData.demo);
  }

  /// Real-time stream for workouts assigned to member or matching their branch
  Stream<List<WorkoutPlan>> streamWorkouts({
    required String memberId,
    String? branch,
    String workspaceId = 'demo-workspace',
  }) {
    if (!_isInitialized && Firebase.apps.isEmpty) {
      return Stream.value(const [
        WorkoutPlan(
          'Star Fitness Push Hypertrophy',
          'Heavy compound pressing and triceps volume for Star Fitness athletes',
          [
            WorkoutExercise('Barbell Bench Press', 4, '8-10'),
            WorkoutExercise('Incline Dumbbell Press', 3, '10-12'),
            WorkoutExercise('Overhead Barbell Press', 4, '8'),
            WorkoutExercise('Cable Tricep Pushdown', 4, '12-15'),
          ],
          source: 'trainer',
        ),
      ]);
    }

    return firestore
        .collection('workspaces/$workspaceId/workouts')
        .snapshots()
        .map((snapshot) {
      final list = <WorkoutPlan>[];
      for (final doc in snapshot.docs) {
        final data = doc.data();
        final assigned = data['assignedTo'];
        final docBranch = data['branch']?.toString().toLowerCase();

        bool isAssigned = false;
        if (assigned is List) {
          isAssigned = assigned.any((id) => id.toString().toLowerCase() == memberId.toLowerCase());
        }

        bool isBranchMatch = false;
        if (branch != null && docBranch != null) {
          isBranchMatch = docBranch == branch.toLowerCase();
        }

        if (isAssigned || isBranchMatch || snapshot.docs.length == 1) {
          final rawExercises = data['exercises'];
          final exercises = <WorkoutExercise>[];
          if (rawExercises is List) {
            for (final ex in rawExercises) {
              if (ex is Map) {
                exercises.add(WorkoutExercise(
                  ex['name']?.toString() ?? 'Exercise',
                  int.tryParse('${ex['sets'] ?? 0}') ?? 0,
                  ex['reps']?.toString() ?? '10-12',
                ));
              }
            }
          }
          list.add(WorkoutPlan(
            data['name']?.toString() ?? 'Workout Plan',
            data['description']?.toString() ?? '',
            exercises,
            source: data['source']?.toString() ?? 'trainer',
          ));
        }
      }
      return list.isNotEmpty ? list : const [
        WorkoutPlan(
          'Star Fitness Signature Routine',
          'Tailored strength & hypertrophy schedule for Star Fitness members',
          [
            WorkoutExercise('Barbell Bench Press', 4, '8-10'),
            WorkoutExercise('Incline Dumbbell Press', 3, '10-12'),
          ],
          source: 'trainer',
        ),
      ];
    }).handleError((_) => const []);
  }

  /// Real-time stream for diet plans assigned to member or matching their branch
  Stream<List<DietPlan>> streamDiets({
    required String memberId,
    String? branch,
    String workspaceId = 'demo-workspace',
  }) {
    if (!_isInitialized && Firebase.apps.isEmpty) {
      return Stream.value(const [
        DietPlan(
          'Star Fitness Lean Muscle Fuel',
          'High protein nutrition plan formulated by Star Fitness nutritionists',
          [
            Meal('Breakfast', 'Oats, whey protein, banana & almonds', 450, protein: 32, carbs: 55, fats: 10),
            Meal('Lunch', 'Brown rice, grilled chicken breast or paneer & salad', 650, protein: 48, carbs: 70, fats: 14),
            Meal('Dinner', 'Roti, dal tadka, steamed greens & tofu/chicken', 520, protein: 38, carbs: 50, fats: 12),
          ],
          source: 'trainer',
        ),
      ]);
    }

    return firestore
        .collection('workspaces/$workspaceId/diets')
        .snapshots()
        .map((snapshot) {
      final list = <DietPlan>[];
      for (final doc in snapshot.docs) {
        final data = doc.data();
        final assigned = data['assignedTo'];
        final docBranch = data['branch']?.toString().toLowerCase();

        bool isAssigned = false;
        if (assigned is List) {
          isAssigned = assigned.any((id) => id.toString().toLowerCase() == memberId.toLowerCase());
        }

        bool isBranchMatch = false;
        if (branch != null && docBranch != null) {
          isBranchMatch = docBranch == branch.toLowerCase();
        }

        if (isAssigned || isBranchMatch || snapshot.docs.length == 1) {
          final rawMeals = data['meals'];
          final meals = <Meal>[];
          if (rawMeals is List) {
            for (final m in rawMeals) {
              if (m is Map) {
                meals.add(Meal(
                  m['type']?.toString() ?? 'Meal',
                  m['items']?.toString() ?? '',
                  int.tryParse('${m['calories'] ?? 0}') ?? 0,
                  protein: int.tryParse('${m['protein'] ?? 0}') ?? 0,
                  carbs: int.tryParse('${m['carbs'] ?? 0}') ?? 0,
                  fats: int.tryParse('${m['fats'] ?? 0}') ?? 0,
                ));
              }
            }
          }
          list.add(DietPlan(
            data['name']?.toString() ?? 'Diet Plan',
            data['description']?.toString() ?? '',
            meals,
            source: data['source']?.toString() ?? 'trainer',
          ));
        }
      }
      return list.isNotEmpty ? list : const [
        DietPlan(
          'Star Fitness Lean Muscle Fuel',
          'High protein nutrition plan formulated by Star Fitness nutritionists',
          [
            Meal('Breakfast', 'Oats, whey protein, banana & almonds', 450, protein: 32, carbs: 55, fats: 10),
            Meal('Lunch', 'Brown rice, grilled chicken breast & salad', 650, protein: 48, carbs: 70, fats: 14),
          ],
          source: 'trainer',
        ),
      ];
    }).handleError((_) => const []);
  }

  /// Record digital check-in to Firestore
  Future<void> recordCheckIn({
    required String memberId,
    String? branch,
    String workspaceId = 'demo-workspace',
  }) async {
    if (!_isInitialized && Firebase.apps.isEmpty) return;

    try {
      final now = DateTime.now();
      final dateStr = '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}';
      await firestore.collection('workspaces/$workspaceId/attendance').add({
        'memberId': memberId,
        'date': dateStr,
        'checkIn': now.toIso8601String(),
        'method': 'App QR Check-in',
        'branch': branch ?? 'Star Fitness Center',
        'status': 'present',
        'createdAt': FieldValue.serverTimestamp(),
      });
    } catch (e) {
      // ignore
    }
  }

  MemberData _memberDataFromDoc(String docId, Map<String, dynamic> data) {
    return MemberData(
      name: data['fullName']?.toString() ?? data['name']?.toString() ?? 'Member',
      memberId: data['memberId']?.toString() ?? docId,
      email: data['email']?.toString() ?? '',
      membership: data['planName']?.toString() ?? data['membership']?.toString() ?? 'All Access VIP Pro',
      expiryDate: data['expiryDate']?.toString() ?? '30 Sep 2026',
      daysLeft: int.tryParse('${data['daysLeft'] ?? 30}') ?? 30,
      visits: int.tryParse('${data['visits'] ?? 18}') ?? 18,
      weight: double.tryParse('${data['weight'] ?? 74.5}') ?? 74.5,
      height: int.tryParse('${data['height'] ?? 176}') ?? 176,
      pendingAmount: double.tryParse('${data['pendingAmount'] ?? 0}') ?? 0,
      secretCode: data['secretCode']?.toString() ?? '749201',
      gymName: data['gymName']?.toString() ?? 'Star Fitness',
      branch: data['branch']?.toString() ?? 'Star Fitness Center',
      gymAddress: data['gymAddress']?.toString() ?? 'Plot 18, Commercial Hub, Sector 62, Noida',
      gymPhone: data['gymPhone']?.toString() ?? '+91 98111 22334',
      gymTimings: data['gymTimings']?.toString() ?? '5:00 AM – 11:30 PM',
    );
  }
}
