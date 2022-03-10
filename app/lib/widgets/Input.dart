import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:mittverk/utils/Theme.dart';

class Input extends StatelessWidget {
  final TextEditingController? controller;
  final String? hintText;
  final TextInputType textInputType;

  Input({this.controller, this.hintText, this.textInputType = TextInputType.text});

  @override
  Widget build(BuildContext context) {
    return TextField(
      decoration: InputDecoration(
        fillColor: Colors.white,
        focusColor: Colors.black.withAlpha(150),
        hintStyle: TextStyle(color: Colors.black.withAlpha(150)),
        hintText: hintText,
        border: OutlineInputBorder(),
        filled: true,
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(12)),
          borderSide: BorderSide(color: Colors.transparent),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(12)),
          borderSide: BorderSide(
            color: MVTheme.secondaryColor,
          ),
        ),
      ),
      controller: controller,
      keyboardType: textInputType,
    );
  }
}
