import 'package:flutter/cupertino.dart';

class Spacing extends StatelessWidget {
  final double amount;
  final bool isVertical;
  static const double modifier = 8;

  Spacing({ this.amount = 1, this.isVertical = false });

  @override
  Widget build(BuildContext context) {
    var spacing = amount * Spacing.modifier;

    if (isVertical) {
      return SizedBox(height: spacing);
    }

    return SizedBox(width: spacing);
  }
}