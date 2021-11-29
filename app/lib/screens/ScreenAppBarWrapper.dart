import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/widgets/AppBar/MittVerkAppBar.dart';

class ScreenAppBarWrapper extends StatelessWidget {
  final Widget? child;

  ScreenAppBarWrapper({this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(appBar: MittVerkAppBar(), body: child);
  }
}
