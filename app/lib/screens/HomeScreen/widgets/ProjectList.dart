import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:provider/provider.dart';
import 'package:mittverk/utils/Theme.dart';

Widget ProjectCardDaysLeft(BuildContext context) {
  return Container(
    decoration: BoxDecoration(
      color: MVTheme.lightOrange,
      borderRadius: BorderRadius.circular(4.0),
    ),
    child: Padding(
      padding: const EdgeInsets.all(6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Icon(
            Icons.access_alarm,
            color: MVTheme.darkOrange,
            size: 12,
          ),
          Spacing(overridePadding: 6, isVertical: false),
          Text(
            '3 Days left',
            style: AvailableFonts.getTextStyle(
              context,
              fontSize: 10,
              color: MVTheme.darkOrange,
            ),
          ),
        ],
      ),
    ),
  );
}

Widget Avatars(BuildContext context, List<String> people) {
  Widget Avatar(String text, int index, {bool special = false}) {
    return Positioned(
      top: 0,
      left: (index * 20).toDouble(),
      child: CircleAvatar(
        maxRadius: 17,
        backgroundColor: Colors.white,
        child: CircleAvatar(
            backgroundColor: special ? Colors.greenAccent : Colors.deepOrange,
            child: Text(text,
                style: AvailableFonts.getTextStyle(context,
                    color: Colors.white, fontSize: 10)),
            maxRadius: 16),
      ),
    );
  }

  int i = 0;
  List<Widget> avatars = [];
  for (final String f in people) {
    avatars.add(Avatar(f, i));
    i++;

    if (i == 4) {
      break;
    }
  }
  if (people.length > 4) {
    avatars.add(Avatar("+" + (people.length - avatars.length).toString(), 4,
        special: true));
  }
  return Container(
    height: 33,
    child: Stack(
      children: <Widget>[...avatars],
    ),
  );
}

class ProjectCard extends StatelessWidget {
  final Project item;

  ProjectCard({this.item});

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Padding(
      padding: const EdgeInsets.all(4.0),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(8.0),
        ),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Text(
                      item.title,
                      style: AvailableFonts.getTextStyle(context,
                          color: MVTheme.mainFont, weight: FontWeight.bold),
                    ),
                    Icon(
                      Icons.more_horiz,
                      color: MVTheme.grayFont,
                      size: 20,
                    )
                  ],
                ),
                Spacing(
                  isVertical: true,
                ),
                Text(
                  item.subTitle,
                  style: AvailableFonts.getTextStyle(context,
                      color: MVTheme.grayFont),
                ),
                Spacing(
                  isVertical: true,
                ),
                ProjectCardDaysLeft(context),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: <Widget>[
                    Text(item.amountDonePercentage,
                        style: AvailableFonts.getTextStyle(context,
                            color: MVTheme.grayFont, fontSize: 10)),
                    Spacing(
                      amount: 0.5,
                      isVertical: true,
                    ),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Container(
                        height: 8,
                        child: LinearProgressIndicator(
                          value: item.amountDoneValue, // percent filled
                          valueColor: AlwaysStoppedAnimation<Color>(
                              MVTheme.mainGreen),
                          backgroundColor: MVTheme.backgroundLightGrap,
                        ),
                      ),
                    ),
                  ],
                ),
                Spacing(
                  amount: 1,
                  isVertical: true,
                ),
                Avatars(context, item.people)
              ]),
        ),
      ),
    );
    ;
  }
}

class ProjectList extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final homeProvider = Provider.of<HomeProvider>(context);

    return Padding(
      padding: const EdgeInsets.all(16),
      child: ListView.builder(
          itemCount: homeProvider.projects.length,
          scrollDirection: Axis.vertical,
          shrinkWrap: true,
          itemBuilder: (BuildContext context, int index) {
            return ProjectCard(item: homeProvider.projects[index]);
          }),
    );
  }
}
