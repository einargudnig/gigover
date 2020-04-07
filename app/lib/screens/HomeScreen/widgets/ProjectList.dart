import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:provider/provider.dart';

class OurColors {
  static Color lightOrange = Color.fromRGBO(255, 244, 236, 1);
  static Color darkOrange = Color.fromRGBO(235, 126, 48, 1);
  static Color mainFont = Color.fromRGBO(7, 16, 41, 1);
  static Color grayFont = Color.fromRGBO(131, 136, 148, 1);
  static Color mainGreen = Color.fromRGBO(31, 223, 131, 1);
  static Color backgroundLightGrap = Color.fromRGBO(233, 233, 239, 1);
}

Widget ProjectCardDaysLeft(BuildContext context) {
  return Container(
    decoration: BoxDecoration(
      color: OurColors.lightOrange,
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
            color: OurColors.darkOrange,
            size: 12,
          ),
          Spacing(
            amount: 0.5,
          ),
          Text(
            '3 Days left',
            style: AvailableFonts.getTextStyle(
              context,
              fontSize: 10,
              color: OurColors.darkOrange,
            ),
          ),
        ],
      ),
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
                      "Laugarsvegur 24",
                      style: AvailableFonts.getTextStyle(context,
                          color: OurColors.mainFont, weight: FontWeight.bold),
                    ),
                    Icon(
                      Icons.more_horiz,
                      color: OurColors.grayFont,
                      size: 20,
                    )
                  ],
                ),
                Spacing(
                  isVertical: true,
                ),
                Text(
                  "Framkv;mdir a einbilyshusi",
                  style: AvailableFonts.getTextStyle(context,
                      color: OurColors.grayFont),
                ),
                Spacing(
                  isVertical: true,
                ),
                ProjectCardDaysLeft(context),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: <Widget>[
                    Text('24%',
                        style: AvailableFonts.getTextStyle(context,
                            color: OurColors.grayFont, fontSize: 10)),
                    Spacing(
                      amount: 0.5,
                      isVertical: true,
                    ),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Container(
                        height: 8,
                        child: LinearProgressIndicator(
                          value: 0.35, // percent filled
                          valueColor: AlwaysStoppedAnimation<Color>(
                              OurColors.mainGreen),
                          backgroundColor: OurColors.backgroundLightGrap,
                        ),
                      ),
                    ),
                  ],
                ),
                Spacing(
                  amount: 1,
                  isVertical: true,
                ),
                Row(
                  children: <Widget>[
                    CircleAvatar(
                        child: Text('AB',
                            style: AvailableFonts.getTextStyle(context,
                                color: Colors.white, fontSize: 10)),
                        maxRadius: 12),
                    CircleAvatar(
                        child: Text('AB',
                            style: AvailableFonts.getTextStyle(context,
                                color: Colors.white, fontSize: 10)),
                        maxRadius: 12),
                    CircleAvatar(
                        child: Text('AB',
                            style: AvailableFonts.getTextStyle(context,
                                color: Colors.white, fontSize: 10)),
                        maxRadius: 12),
                  ],
                ),
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

    return Expanded(
      child: Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: ListView.builder(
            itemCount: homeProvider.test.length,
            scrollDirection: Axis.vertical,
            shrinkWrap: true,
            itemBuilder: (BuildContext context, int index) {
              return ProjectCard(item: homeProvider.test[index]);
            }),
      ),
    );
  }
}
