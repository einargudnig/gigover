import 'package:flutter/cupertino.dart';

class Divider extends StatelessWidget {
  final double amount;
  final bool isVertical;

  static double modifier = 8;

  Divider({ this.amount = 1, this.isVertical = false });

  @override
  Widget build(BuildContext context) {
    var spacing = amount * Divider.modifier;

    if (isVertical) {
      return SizedBox(height: spacing);
    }

    return SizedBox(width: spacing);
  }
}