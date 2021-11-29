import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class DebugBorder extends StatelessWidget {
  final Widget? child;

  DebugBorder({ this.child });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        border: Border.all(color: Colors.red)
      ),
      child: child
    );
  }
}