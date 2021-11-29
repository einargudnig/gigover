import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/ScaleTap.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/models/Task.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/utils/TimeTrackingString.dart';
import 'package:mittverk/widgets/CardBox.dart';
import 'package:mittverk/widgets/CardTitle.dart';
import 'package:mittverk/widgets/ProjectTypeLabel.dart';
import 'package:provider/provider.dart';

class TaskCard extends StatefulWidget {
  final Task? task;

  TaskCard(this.task);

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
        final homeProvider = Provider.of<HomeProvider>(context, listen: false);
        homeProvider.goToTaskDetail(widget.task);
      },
      child: CardBox(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              CardTitle(title: widget.task!.getTitle()),
              Spacing(isVertical: true, amount: 1,),
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: <Widget>[
                  Text(timeTrackedFromMinutes(widget.task!.minutes!), style: AvailableFonts.getTextStyle(context, fontSize: 11)),
              ProjectTypeLabel(typeId: widget.task!.typeId),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
