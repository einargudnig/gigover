import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/widgets/ScaleTap.dart';
import 'package:mittverk/models/Task.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/widgets/Avatars.dart';
import 'package:mittverk/widgets/CardBox.dart';
import 'package:mittverk/widgets/CardTitle.dart';
import 'package:provider/provider.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';

class TaskCard extends StatefulWidget {
  final Task task;

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
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              CardTitle(title: widget.task.text),
            ],
          ),
        ),
      ),
    );
  }
}
