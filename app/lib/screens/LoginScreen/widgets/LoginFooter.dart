import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';

class LoginFooter extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(Spacing.modifier * 3),
      child: Text(
        'Need help with signing in?',
        style: AvailableFonts.getTextStyle(context, color: Colors.white),
      ),
    );
  }

}
