import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Dialog.dart';
import 'package:mittverk/igital/widgets/RoundedButton.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/models/Task.dart';
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
              Icon(Icons.access_alarm, color: Color.fromRGBO(31, 223, 131, 1)),
              Spacing(
                isVertical: false,
                amount: 1,
              ),
              Text(
                'Tímaskráning',
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
                IgitalDropdownButton<Project>(
                  context,
                  'Veldu verkefni',
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
                IgitalDropdownButton<Task>(
                  context,
                  'Veldu verkþátt',
                  homeProvider.currentTrackedTask,
                  homeProvider.currentTrackedProject.tasks ?? [],
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
                  'Hætta',
                  style: AvailableFonts.getTextStyle(
                    context,
                    weight: FontWeight.bold,
                    fontSize: 16.scale,
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
                  fillBackground: Color.fromRGBO(31, 223, 131, 1),
                  onTap: () {
                    homeProvider.startTimer();
                    Navigator.of(context, rootNavigator: true).pop("Discard");
                  },
                  small: true,
                  child: Text(
                    'Hefja tímatöku',
                    style: AvailableFonts.getTextStyle(
                      context,
                      weight: FontWeight.bold,
                      fontSize: 16.scale,
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
