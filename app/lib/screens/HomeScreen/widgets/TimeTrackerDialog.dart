// ignore: must_be_immutable
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Dialog.dart';
import 'package:mittverk/igital/widgets/RoundedButton.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:provider/provider.dart';

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
              Text('Tímaskráning',
                  style: AvailableFonts.getTextStyle(
                    context,
                    fontSize: 28,
                    weight: FontWeight.bold,
                    color: Colors.black,
                  ))
            ],
          ),
          Spacing(
            amount: 4,
          ),
          Container(
            child: Column(
              children: <Widget>[
                dropdownButton(
                    context,
                    'Veldu verkefni',
                    homeProvider.currentProject.title,
                    homeProvider.projects.map((t) {
                      return t.title;
                    }).toList(), onTap: (String s) {
                  homeProvider.setCurrentProject(s);
                }),
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
                dropdownButton(
                    context,
                    'Veldu verkþátt',
                    homeProvider.currentTask.title,
                    homeProvider.currentProject.tasks.map((t) {
                      return t.title;
                    }).toList(), onTap: (String s) {
                  homeProvider.setCurrentTask(s);
                }),
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
                  text: 'Hætta'),
              Spacing(amount: 2, isVertical: false),
              Expanded(
                flex: 1,
                child: RoundedButton(
                    padding: EdgeInsets.all(20.0),
                    fillBackground: Color.fromRGBO(31, 223, 131, 1),
                    textColor: Color.fromRGBO(7, 16, 41, 1),
                    onTap: () {
                      homeProvider.stopwatch.startStopWatch();
                      Navigator.of(context, rootNavigator: true).pop("Discard");
                    },
                    text: 'Hefja tímatöku'),
              ),
            ],
          )
        ],
      ),
    );
  }
}

Widget dropdownButton(
    context, String prefixTitle, String item, List<String> items,
    {Function onTap}) {
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: <Widget>[
      Text(
        prefixTitle,
        style: AvailableFonts.getTextStyle(
          context,
          fontSize: 14,
          color: Colors.grey,
        ),
      ),
      DropdownButton<String>(
        value: item,
        icon:
            Icon(Icons.arrow_drop_down, color: MVTheme.secondaryColor),
        iconSize: 24,
        elevation: 16,
        style: AvailableFonts.getTextStyle(
          context,
          fontSize: 22,
          color: Colors.black,
        ),
        isExpanded: true,
        underline: Container(
          height: 2,
          color: MVTheme.secondaryColor,
        ),
        onChanged: (String newValue) {
          onTap(newValue);
        },
        items: items.map<DropdownMenuItem<String>>((String value) {
          return DropdownMenuItem<String>(
            value: value,
            child: Text(value),
          );
        }).toList(),
      ),
    ],
  );
}
