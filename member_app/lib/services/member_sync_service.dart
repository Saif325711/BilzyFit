import 'dart:convert';
import 'dart:io';

import '../models/member_data.dart';

class MemberSyncService {
  const MemberSyncService();

  // The Vite host must be reachable by the phone on the same Wi-Fi network.
  static const baseUrl = 'http://192.168.1.11:5173';

  Future<MemberPlans> fetchMemberPlans({
    required String workspaceId,
    required String memberEmail,
  }) async {
    final uri = Uri.parse(
      '$baseUrl/api/workspaces/${Uri.encodeComponent(workspaceId)}/member-content'
      '?email=${Uri.encodeQueryComponent(memberEmail)}',
    );
    final client = HttpClient();
    try {
      final request = await client.getUrl(uri);
      final response = await request.close();
      if (response.statusCode != HttpStatus.ok) {
        throw HttpException(
          'Member workout sync failed with status ${response.statusCode}.',
          uri: uri,
        );
      }
      final payload = jsonDecode(await response.transform(utf8.decoder).join());
      final rawWorkouts = payload['workouts'];
      final rawDiets = payload['diets'];
      return MemberPlans(
        rawWorkouts is List
            ? rawWorkouts.whereType<Map>().map(_toWorkoutPlan).toList(growable: false)
            : const [],
        rawDiets is List
            ? rawDiets.whereType<Map>().map(_toDietPlan).toList(growable: false)
            : const [],
      );
    } finally {
      client.close(force: true);
    }

  }

  Future<void> publishPlan({
    required String workspaceId,
    required String memberEmail,
    required String memberName,
    WorkoutPlan? workout,
    DietPlan? diet,
  }) async {
    final uri = Uri.parse(
      '$baseUrl/api/workspaces/${Uri.encodeComponent(workspaceId)}/member-content',
    );
    final client = HttpClient();
    try {
      final request = await client.postUrl(uri);
      request.headers.contentType = ContentType.json;
      request.write(jsonEncode({
        'memberEmail': memberEmail,
        'memberName': memberName,
        if (workout != null) 'workout': _workoutJson(workout),
        if (diet != null) 'diet': _dietJson(diet),
      }));
      final response = await request.close();
      if (response.statusCode != HttpStatus.ok) {
        throw HttpException('Member plan publish failed with status ${response.statusCode}.', uri: uri);
      }
    } finally {
      client.close(force: true);
    }
  }

  WorkoutPlan _toWorkoutPlan(Map workout) {
    final rawExercises = workout['exercises'];
    final exercises = rawExercises is List
        ? rawExercises.whereType<Map>().map((exercise) {
            final sets = int.tryParse('${exercise['sets'] ?? ''}') ?? 0;
            final reps = '${exercise['reps'] ?? ''}'.trim();
            return WorkoutExercise(
              '${exercise['name'] ?? 'Exercise'}',
              sets,
              reps.isEmpty ? 'As prescribed' : reps,
            );
          }).toList(growable: false)
        : const <WorkoutExercise>[];
    return WorkoutPlan(
      '${workout['name'] ?? 'My workout'}',
      '${workout['description'] ?? ''}',
      exercises,
      source: '${workout['source'] ?? 'recommended'}',
    );
  }

  DietPlan _toDietPlan(Map diet) {
    final rawMeals = diet['meals'];
    final meals = rawMeals is List
        ? rawMeals.whereType<Map>().map((meal) => Meal(
              '${meal['type'] ?? 'Meal'}',
              '${meal['items'] ?? ''}',
              int.tryParse('${meal['calories'] ?? 0}') ?? 0,
              protein: int.tryParse('${meal['protein'] ?? 0}') ?? 0,
              carbs: int.tryParse('${meal['carbs'] ?? 0}') ?? 0,
              fats: int.tryParse('${meal['fats'] ?? 0}') ?? 0,
            )).toList(growable: false)
        : const <Meal>[];
    return DietPlan(
      '${diet['name'] ?? 'My diet'}',
      '${diet['description'] ?? ''}',
      meals,
      source: '${diet['source'] ?? 'recommended'}',
    );
  }

  Map<String, dynamic> _workoutJson(WorkoutPlan plan) => {
        'name': plan.name,
        'description': plan.description,
        'exercises': plan.exercises
            .map((exercise) => {
                  'name': exercise.name,
                  'sets': exercise.sets,
                  'reps': exercise.reps,
                })
            .toList(),
      };

  Map<String, dynamic> _dietJson(DietPlan plan) => {
        'name': plan.name,
        'description': plan.description,
        'meals': plan.meals
            .map((meal) => {
                  'type': meal.type,
                  'items': meal.items,
                  'calories': meal.calories,
                  'protein': meal.protein,
                  'carbs': meal.carbs,
                  'fats': meal.fats,
                })
            .toList(),
      };
}

class MemberPlans {
  const MemberPlans(this.workouts, this.diets);

  final List<WorkoutPlan> workouts;
  final List<DietPlan> diets;
}
