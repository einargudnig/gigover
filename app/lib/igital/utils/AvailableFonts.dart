import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class AvailableFonts {
  static TextStyle getTextStyle(
    BuildContext context, {
    double fontSize = 14,
    Color color = Colors.black,
    FontWeight weight = FontWeight.normal,
    FontStyle fontStyle = FontStyle.normal,
  }) {
    return TextStyle(
      fontFamily: Platform.isIOS
          ? DefaultTextStyle.of(context).style.fontFamily
          : 'Roboto',
      fontSize: fontSize,
      color: color,
      fontWeight: weight,
      decoration: TextDecoration.none,
      fontStyle: fontStyle,
    );
  }
}
