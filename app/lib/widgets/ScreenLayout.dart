import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class ScreenLayout extends StatelessWidget {
  final Widget? child;

  ScreenLayout({ this.child });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).backgroundColor,
      ),
      child: child
    );
  }

}