import 'package:flutter/widgets.dart';
import 'package:mittverk/widgets/CardBox.dart';
import 'package:mittverk/widgets/CardTitle.dart';

class TaskCard extends StatefulWidget {
  @override
  State createState() => TaskCardState();
}

class TaskCardState extends State<TaskCard>
    with SingleTickerProviderStateMixin {
  double _scale = 1.0;
  AnimationController _animationController;

  @override
  void initState() {
    super.initState();

    _animationController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 50),
      lowerBound: 0.0,
      upperBound: 0.08,
    )..addListener(() {
        setState(() {});
      });
  }

  void tapDownRoundedButton(TapDownDetails details) {
    _animationController.forward();
  }

  void tapUpRoundedButton(TapUpDetails details) {
    resetAnimation();
  }

  void resetAnimation() {
    _animationController.reverse();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        //widget.onTap();
      },
      onTapDown: tapDownRoundedButton,
      onTapUp: tapUpRoundedButton,
      onTapCancel: resetAnimation,
      child: Transform.scale(
        scale: _scale,
        child: CardBox(
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: <Widget>[
                CardTitle(
                  subtitle: 'Assigned to you',
                  title: 'Task number 1'
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
