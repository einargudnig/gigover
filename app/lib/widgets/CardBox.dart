import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class CardBoxProps {
  final double? borderRadius;
  final bool? hasBoxShadow;

  CardBoxProps({
    this.borderRadius,
    this.hasBoxShadow,
  });

}

class CardBox extends StatelessWidget implements CardBoxProps {
  final Widget? child;

  @override
  final double borderRadius;

  @override
  final bool hasBoxShadow;

  CardBox({
    required this.child,
    this.borderRadius = 8.0,
    this.hasBoxShadow = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(borderRadius),
        boxShadow: hasBoxShadow
            ? [
                BoxShadow(
                  offset: Offset.fromDirection(90, 5),
                  color: Colors.black.withAlpha(10),
                  blurRadius: 19,
                ),
              ]
            : null,
      ),
      child: child,
    );
  }
}
