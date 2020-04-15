
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class Consts {
  Consts._();

  static const double padding = 24.0;
}

// ignore: must_be_immutable
class LSDialog extends StatelessWidget {
  List<Widget> children;
  Color backgroundColor = Colors.white;

  LSDialog({ children, backgroundColor }) {
    this.children = children;

    if (backgroundColor != null) {
      this.backgroundColor = backgroundColor;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (this.children == null || this.children.length <= 0) {
      return null;
    }

    return Container(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: <Widget>[...this.children],
      ),
      padding: EdgeInsets.only(
        top: Consts.padding * 2,
        bottom: Consts.padding * 2,
        left: Consts.padding,
        right: Consts.padding,
      ),
      decoration: new BoxDecoration(
        color: this.backgroundColor,
        shape: BoxShape.rectangle,
        borderRadius: BorderRadius.only(
          topRight: Radius.circular(16),
          topLeft: Radius.circular(16),
        ),
      ),
    );
  }
}