import 'package:flutter/material.dart';

/* Padding */
extension WidgetPadding on Widget {
  Widget paddingAll(num padding) => Padding(
        padding: EdgeInsets.all(padding.toDouble()),
        child: this,
      );

  Widget paddingSymmetric({num vertical = 0.0, num horizontal = 0.0}) =>
      Padding(
        padding: EdgeInsets.symmetric(
            vertical: vertical.toDouble(), horizontal: horizontal.toDouble()),
        child: this,
      );

  Widget paddingOnly(
          {num left = 0.0, num top = 0.0, num right = 0.0, num bottom = 0.0}) =>
      Padding(
        padding: EdgeInsets.only(
            left: left.toDouble(),
            top: top.toDouble(),
            right: right.toDouble(),
            bottom: bottom.toDouble()),
        child: this,
      );
}

/* Positioned */
extension WidgetPosition on Widget {
  Widget positioned({num left, num top, num right, num bottom}) => Positioned(
        left: left,
        top: top,
        right: right,
        bottom: bottom,
        child: this,
      );
}
