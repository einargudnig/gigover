import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class AvailableFonts {

  static TextStyle getTextStyle(
    BuildContext context, {
    double fontSize = 14,
    Color color = Colors.black,
    FontWeight weight = FontWeight.normal,
  }) {
    return TextStyle(
      fontFamily: DefaultTextStyle.of(context).style.fontFamily,
      fontSize: fontSize,
      color: color,
      fontWeight: weight,
    );
  }

}
