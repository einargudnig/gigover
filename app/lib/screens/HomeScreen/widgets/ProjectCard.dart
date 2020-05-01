import 'package:flutter/material.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/CardBox.dart';

import '../../../widgets/Avatars.dart';

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

class ProjectCard extends StatelessWidget implements CardBoxProps {
  final Project item;

  @override
  final double borderRadius;

  @override
  final bool hasBoxShadow;

  ProjectCard({ this.item, this.borderRadius = 8.0, this.hasBoxShadow = true });

  @override
  Widget build(BuildContext context) {
    return Hero(
      tag: 'ProjectCard_${item.id}',
      child: CardBox(
        hasBoxShadow: true,
        borderRadius: borderRadius,
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
                        valueColor:
                            AlwaysStoppedAnimation<Color>(MVTheme.mainGreen),
                        backgroundColor: MVTheme.backgroundGray,
                      ),
                    ),
                  ),
                ],
              ),
              Spacing(
                amount: 1,
                isVertical: true,
              ),
              Avatars(context, item.people),
            ],
          ),
        ),
      ),
    );
  }
}
