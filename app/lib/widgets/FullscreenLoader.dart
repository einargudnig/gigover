import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/widgets/IgitalScrollBehaviour.dart';
import 'package:mittverk/utils/Theme.dart';

import 'LoadingSpinner.dart';

class FullscreenLoader extends StatelessWidget {
  Widget splashScreen(Widget child) {
    return MaterialApp(
      builder: (context, child) {
        return ScrollConfiguration(
          behavior: IgitalScrollBehaviour(),
          child: child,
        );
      },
      home: Container(
        decoration: BoxDecoration(
          color: MVTheme.primaryColor,
        ),
        child: Center(
          child: child,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return splashScreen(Container(
      color: MVTheme.primaryColor,
      child: Center(
          child: LoadingSpinner(
        radius: 15,
        dotRadius: 6,
      )),
    ));
  }
}
