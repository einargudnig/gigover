import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/widgets/ScaleTap.dart';
import 'package:mittverk/widgets/Avatars.dart';
import 'package:mittverk/widgets/CardBox.dart';
import 'package:mittverk/widgets/CardTitle.dart';

class TaskCard extends StatefulWidget {
  @override
  State createState() => TaskCardState();
}

class TaskCardState extends State<TaskCard> {
  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTap(
      onTap: () {
        print('Tapping task!');
      },
      child: CardBox(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              CardTitle(title: 'Task number 1'),
              onlyAvatar(context, text: 'AV', circleSize: 14),
            ],
          ),
        ),
      ),
    );
  }
}
