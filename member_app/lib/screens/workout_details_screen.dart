import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class WorkoutDetailsScreen extends StatefulWidget {
  const WorkoutDetailsScreen({
    super.key,
    this.title = 'Full Body Training',
    this.duration = '30 min',
    this.level = 'Beginner',
    this.calories = '320',
    this.exercisesCount = '8',
    this.rating = '4.8',
    this.imageUrl =
        'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    this.description =
        'A complete full body workout to help you build strength and stay fit.',
  });

  final String title;
  final String duration;
  final String level;
  final String calories;
  final String exercisesCount;
  final String rating;
  final String imageUrl;
  final String description;

  @override
  State<WorkoutDetailsScreen> createState() => _WorkoutDetailsScreenState();
}

class _WorkoutDetailsScreenState extends State<WorkoutDetailsScreen> {
  bool _isFavorite = true;
  bool _isStarted = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar: Back Button & Favorite Heart
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: AppTheme.neuCircle(),
                      child: const Icon(
                        Icons.arrow_back_rounded,
                        color: AppTheme.textPrimary,
                        size: 20,
                      ),
                    ),
                  ),
                  GestureDetector(
                    onTap: () {
                      setState(() => _isFavorite = !_isFavorite);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(_isFavorite
                              ? 'Saved to favorites'
                              : 'Removed from favorites'),
                          duration: const Duration(seconds: 1),
                        ),
                      );
                    },
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: AppTheme.neuCircle(),
                      child: Icon(
                        _isFavorite ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                        color: const Color(0xFFFF4848),
                        size: 20,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Large Hero Image with Neumorphic card frame
                    Container(
                      width: double.infinity,
                      height: 250,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(24),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.shadowDark.withValues(alpha: 0.7),
                            offset: const Offset(4, 4),
                            blurRadius: 14,
                          ),
                          const BoxShadow(
                            color: AppTheme.shadowLight,
                            offset: Offset(-4, -4),
                            blurRadius: 14,
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(24),
                        child: Stack(
                          fit: StackFit.expand,
                          children: [
                            Image.network(
                              widget.imageUrl,
                              fit: BoxFit.cover,
                              errorBuilder: (context, error, stackTrace) => Container(
                                color: const Color(0xFF2A2D4A),
                                child: const Center(
                                  child: Icon(
                                    Icons.fitness_center_rounded,
                                    size: 80,
                                    color: Colors.white54,
                                  ),
                                ),
                              ),
                            ),
                            // Subtle gradient overlay at bottom
                            Positioned(
                              bottom: 0,
                              left: 0,
                              right: 0,
                              height: 80,
                              child: DecoratedBox(
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topCenter,
                                    end: Alignment.bottomCenter,
                                    colors: [
                                      Colors.transparent,
                                      Colors.black.withValues(alpha: 0.4),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Title
                    Text(
                      widget.title,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textPrimary,
                        letterSpacing: -0.4,
                      ),
                    ),
                    const SizedBox(height: 4),

                    // Subtitle
                    Text(
                      '${widget.duration} • ${widget.level}',
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.textSecondary,
                        fontWeight: FontWeight.w500,
                      ),
                    ),

                    const SizedBox(height: 20),

                    // 3 Neumorphic Stat Boxes (Calories, Exercises, Rating)
                    Row(
                      children: [
                        Expanded(
                          child: _statBox(
                            icon: Icons.local_fire_department_rounded,
                            iconColor: const Color(0xFFFF5252),
                            value: widget.calories,
                            label: 'Calories',
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: _statBox(
                            icon: Icons.grid_view_rounded,
                            iconColor: const Color(0xFF6C63FF),
                            value: widget.exercisesCount,
                            label: 'Exercises',
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: _statBox(
                            icon: Icons.star_rounded,
                            iconColor: const Color(0xFFFFB300),
                            value: widget.rating,
                            label: 'Rating',
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Description Heading
                    const Text(
                      'Description',
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.textPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Description text
                    Text(
                      widget.description,
                      style: const TextStyle(
                        fontSize: 14,
                        color: AppTheme.textSecondary,
                        height: 1.5,
                      ),
                    ),

                    const SizedBox(height: 28),

                    // Start Workout Button
                    GestureDetector(
                      onTap: () {
                        setState(() => _isStarted = !_isStarted);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(_isStarted
                                ? 'Workout Session Started! Keep pushing! 💪'
                                : 'Workout paused'),
                            backgroundColor: AppTheme.primary,
                          ),
                        );
                      },
                      child: Container(
                        width: double.infinity,
                        height: 56,
                        decoration: AppTheme.neuButton(radius: 28),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              _isStarted
                                  ? Icons.pause_rounded
                                  : Icons.play_arrow_rounded,
                              color: Colors.white,
                              size: 24,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              _isStarted ? 'Pause Workout' : 'Start Workout',
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 0.3,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _statBox({
    required IconData icon,
    required Color iconColor,
    required String value,
    required String label,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
      decoration: AppTheme.neuBox(radius: 18),
      child: Column(
        children: [
          Icon(icon, color: iconColor, size: 24),
          const SizedBox(height: 6),
          Text(
            value,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: AppTheme.textPrimary,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              color: AppTheme.textSecondary,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
