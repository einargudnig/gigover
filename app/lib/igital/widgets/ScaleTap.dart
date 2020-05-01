import 'package:flutter/widgets.dart';

class ScaleTap extends StatefulWidget {
  final double lowerBound;
  final double upperBound;
  final int milliseconds;
  final Function onTap;
  final Widget child;

  ScaleTap({
    @required this.onTap,
    @required this.child,
    this.lowerBound = 0.0,
    this.upperBound = 0.08,
    this.milliseconds = 50,
  });

  @override
  State createState() => ScaleTapState();
}

class ScaleTapState extends State<ScaleTap>
    with SingleTickerProviderStateMixin {
  double _scale;
  AnimationController _ctrl;

  @override
  void initState() {
    super.initState();

    _ctrl = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: widget.milliseconds),
      lowerBound: widget.lowerBound,
      upperBound: widget.upperBound,
    )..addListener(() {
        setState(() {});
      });
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  void tapDownScale(TapDownDetails details) {
    _ctrl.forward();
  }

  void tapUpScale(TapUpDetails details) {
    resetAnimation();
  }

  void resetAnimation() {
    _ctrl.reverse();
  }

  @override
  Widget build(BuildContext context) {
    if (_ctrl != null) {
      _scale = 1 - _ctrl.value;
    } else {
      _scale = 1;
    }

    return GestureDetector(
      onTap: () {
        widget.onTap();
      },
      onTapDown: tapDownScale,
      onTapUp: tapUpScale,
      onTapCancel: resetAnimation,
      child: Transform.scale(scale: _scale, child: widget.child),
    );
  }
}
