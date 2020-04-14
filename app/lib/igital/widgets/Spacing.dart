import 'package:flutter/cupertino.dart';

class Spacing extends StatelessWidget {
  final double amount;
  final bool isVertical;
  final double overridePadding;
  static const double modifier = 8;

  Spacing({this.amount = 1, this.isVertical = true, this.overridePadding = 0});

  Widget build(BuildContext context) {
    var spacing = (this.overridePadding == 0 || this.overridePadding == null)
        ? amount * Spacing.modifier
        : this.overridePadding;

    if (isVertical) {
      return SizedBox(height: spacing);
    }

    return SizedBox(width: spacing);
  }
}
