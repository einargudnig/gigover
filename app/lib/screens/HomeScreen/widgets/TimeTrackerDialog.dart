import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Dialog.dart';
import 'package:mittverk/igital/widgets/RoundedButton.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/models/ProjectStatus.dart';
import 'package:mittverk/models/Task.dart';
import 'package:mittverk/models/TaskStatus.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/igital/widgets/IgitalDropdownButton.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:provider/provider.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';

class TimeTrackerDialog extends StatelessWidget {
  TimeTrackerDialog();

  @override
  Widget build(BuildContext context) {
    final homeProvider = Provider.of<HomeProvider>(context);

    return Material(
      child: LSDialog(
        children: [
          Row(
            children: <Widget>[
              Icon(Icons.access_alarm, color: MVTheme.secondaryColor),
              Spacing(
                isVertical: false,
                amount: 1,
              ),
              Text(
                'Log time',
                style: AvailableFonts.getTextStyle(
                  context,
                  fontSize: 28,
                  weight: FontWeight.bold,
                  color: Colors.black,
                ),
              )
            ],
          ),
          Spacing(
            amount: 4,
          ),
          Container(
            child: Column(
              children: <Widget>[
                IgitalDropdownButton<Project?>(
                  context,
                  'Select project',
                  homeProvider.currentTrackedProject,
                  homeProvider.projects,
                  onTap: (Project p) {
                    homeProvider.setCurrentProject(p);
                  },
                ),
                Spacing(),
              ],
            ),
          ),
          Spacing(
            amount: 4,
          ),
          Container(
            child: Column(
              children: <Widget>[
                IgitalDropdownButton<Task?>(
                  context,
                  'Select task',
                  homeProvider.currentTrackedTask,
                  homeProvider
                      .currentTrackedProject!
                      .tasks!
                      .where((t) => t.status != TaskStatus.Archived)
                      .toList(),
                  onTap: (Task task) {
                    homeProvider.setCurrentTask(task);
                  },
                ),
                Spacing(),
              ],
            ),
          ),
          Spacing(
            amount: 4,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            mainAxisSize: MainAxisSize.max,
            children: <Widget>[
              RoundedButton(
                padding: EdgeInsets.all(20.0),
                textColor: Color.fromRGBO(176, 189, 220, 1),
                borderColorFromTextColor: true,
                onTap: () {
                  Navigator.of(context, rootNavigator: true).pop("Discard");
                },
                small: true,
                child: Text(
                  'Exit',
                  style: AvailableFonts.getTextStyle(
                    context,
                    weight: FontWeight.bold,
                    fontSize: 16.scale as double,
                    color: Color.fromRGBO(176, 189, 220, 1),
                  ),
                ),
              ),
              Spacing(amount: 2, isVertical: false),
              Expanded(
                flex: 1,
                child: RoundedButton(
                  disabled: homeProvider.currentTrackedTask == null ||
                      homeProvider.currentTrackedProject == null,
                  padding: EdgeInsets.all(20.0),
                  fillBackground: MVTheme.secondaryColor,
                  onTap: () {
                    homeProvider.startTimer();
                    Navigator.of(context, rootNavigator: true).pop("Discard");
                  },
                  small: true,
                  child: Text(
                    'Start time log',
                    style: AvailableFonts.getTextStyle(
                      context,
                      weight: FontWeight.bold,
                      fontSize: 16.scale as double,
                      color: MVTheme.mainFont,
                    ),
                  ),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}
