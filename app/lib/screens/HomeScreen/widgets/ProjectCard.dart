import 'package:flutter/material.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/utils/TimeTrackingString.dart';
import 'package:mittverk/widgets/CardBox.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';

Widget projectCardDaysLeft(BuildContext context, Project item) {
  if (item.minutes == null) {
    return Container();
  }
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
            timeTrackedFromMinutes(item.minutes!),
            style: AvailableFonts.getTextStyle(
              context,
              fontSize: 12.scale as double,
              color: MVTheme.darkOrange,
            ),
          ),
        ],
      ),
    ),
  );
}

class ProjectCard extends StatelessWidget implements CardBoxProps {
  final Project? item;

  @override
  final double borderRadius;

  @override
  final bool hasBoxShadow;

  ProjectCard({this.item, this.borderRadius = 8.0, this.hasBoxShadow = true});

  @override
  Widget build(BuildContext context) {
    return Hero(
      tag: 'ProjectCard_${item!.projectId}',
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
                    item!.name!,
                    style: AvailableFonts.getTextStyle(
                      context,
                      fontSize: 16.scale as double,
                      color: MVTheme.mainFont,
                      weight: FontWeight.bold,
                    ),
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
                item!.description!,
                style: AvailableFonts.getTextStyle(
                  context,
                  color: MVTheme.grayFont,
                  fontSize: 14.scale as double,
                ),
              ),
              Spacing(
                isVertical: true,
              ),
              projectCardDaysLeft(context, item!),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: <Widget>[
                  Text(
                    item!.amountDonePercentage,
                    style: AvailableFonts.getTextStyle(
                      context,
                      color: MVTheme.grayFont,
                      fontSize: 12.scale as double,
                    ),
                  ),
                  Spacing(
                    amount: 0.5,
                    isVertical: true,
                  ),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      height: 8,
                      child: LinearProgressIndicator(
                        value: item!.amountDoneValue / 100, // percent filled
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

              /// TODO ADD PEOPLE AGAIN ? Avatars(context, item.people),
            ],
          ),
        ),
      ),
    );
  }
}
