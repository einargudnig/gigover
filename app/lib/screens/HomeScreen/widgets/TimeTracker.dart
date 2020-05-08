import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/RoundedButton.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:provider/provider.dart';

import 'TimeTrackerDialog.dart';

class TimeTracker extends StatelessWidget {
  TimeTracker();

  String formatTime(ElapsedTime time) {
    if (time == null || (time.minutes == null && time.seconds == null)) {
      return '00:00';
    }
    String minutesStr = (time.minutes % 60).toString().padLeft(2, '0');
    String secondsStr = (time.seconds % 60).toString().padLeft(2, '0');
    return '$minutesStr:$secondsStr';
  }

  Widget timerActions(BuildContext context) {
    final homeProvider = Provider.of<HomeProvider>(context);

    if (homeProvider.stopwatch.currentStopwatch.isRunning) {
      return Row(
        children: <Widget>[
          Expanded(
            child: RoundedButton(
                padding: EdgeInsets.all(20.0),
                fillBackground: Color.fromRGBO(31, 223, 131, 1),
                textColor: Color.fromRGBO(7, 16, 41, 1),
                onTap: () {
                  homeProvider.pauseTimer();
                },
                child: SvgPicture.asset(
                  'assets/icons/pause.svg',
                  width: 28,
                  height: 28,
                )),
          ),
          Spacing(
            isVertical: false,
            amount: 2,
          ),
          Expanded(
            child: RoundedButton(
                padding: EdgeInsets.all(20.0),
                fillBackground: Color.fromRGBO(31, 223, 131, 1),
                textColor: Color.fromRGBO(7, 16, 41, 1),
                onTap: () {
                  print('open modal with dialgo thingy');
                  homeProvider.goToTaskDetail(homeProvider.currentTrackedTask);
                },
                child: SvgPicture.asset(
                  'assets/icons/comment.svg',
                  width: 28,
                  height: 28,
                )),
          ),
        ],
      );
    } else {
      return Row(children: <Widget>[
        Expanded(
          child: RoundedButton(
              padding: EdgeInsets.all(20.0),
              fillBackground: Color.fromRGBO(31, 223, 131, 1),
              textColor: Color.fromRGBO(7, 16, 41, 1),
              onTap: () {
                homeProvider.startTimer();
              },
              child: SvgPicture.asset(
                'assets/icons/resume.svg',
                width: 24,
                height: 24,
              )),
        ),
        Spacing(
          isVertical: false,
          amount: 2,
        ),
        Expanded(
            child: RoundedButton(
                padding: EdgeInsets.all(20.0),
                fillBackground: Color.fromRGBO(31, 223, 131, 1),
                textColor: Color.fromRGBO(7, 16, 41, 1),
                onTap: () {
                  homeProvider.resetTimer();
                },
                child: SvgPicture.asset(
                  'assets/icons/stop.svg',
                  width: 28,
                  height: 28,
                )))
      ]);
    }
  }

  Widget timeItem(String currentTime) {
    return Expanded(
      child: RoundedButton(
          padding: EdgeInsets.all(20.0),
          textColor: Color.fromRGBO(7, 16, 41, 1),
          borderColorFromTextColor: true,
          onTap: () {},
          text: currentTime),
    );
  }

  @override
  Widget build(BuildContext context) {
    final homeProvider = Provider.of<HomeProvider>(context);
    print(homeProvider.stopwatch.currentStopWatchDuration);
    print('------------------currentStopWatch');
    if (homeProvider.stopwatch.currentStopWatchDuration != Duration.zero) {
      return Container(
        padding: EdgeInsets.only(left: 24, right: 24, top: 16, bottom: 16),
        decoration: new BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.only(
            topRight: Radius.circular(16),
            topLeft: Radius.circular(16),
          ),
        ),
        child: Stack(children: [
          Positioned(
            top: 0,
            right: 0,
            child: Icon(
                !homeProvider.panelController.isPanelOpen
                    ? Icons.arrow_drop_up
                    : Icons.arrow_drop_down,
                size: 36,
                color: Color.fromRGBO(31, 223, 131, 1)),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    homeProvider.currentTrackedProject.toString(),
                    style: AvailableFonts.getTextStyle(context,
                        color: MVTheme.grayFont, weight: FontWeight.bold),
                  ),
                  Spacing(
                    amount: 0.5,
                  ),
                  Text(homeProvider.currentTrackedTask.toString(),
                      style: AvailableFonts.getTextStyle(context,
                          color: MVTheme.mainFont,
                          weight: FontWeight.bold,
                          fontSize: 20))
                ],
              ),
              Spacing(
                amount: 2,
              ),
              Row(
                children: <Widget>[
                  timeItem(
                      formatTime(homeProvider.stopwatch.currentElapsedTime)),
                  Spacing(
                    isVertical: false,
                    amount: 2,
                  ),
                  Expanded(
                    child: timerActions(context),
                  )
                ],
              ),
            ],
          ),
        ]),
      );
    }

    return Row(crossAxisAlignment: CrossAxisAlignment.start, children: <Widget>[
      Expanded(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Container(
            height: 54,
            child: RoundedButton(
              fillBackground: Color.fromRGBO(31, 223, 131, 1),
              textColor: Color.fromRGBO(7, 16, 41, 1),
              onTap: () {
                showCupertinoModalPopup(
                  context: context,
                  builder: (_) {
                    return ChangeNotifierProvider.value(
                        value: homeProvider, child: TimeTrackerDialog());
                  },
                );
              },
              child: Text(
                'Tímaskráning',
                style: AvailableFonts.getTextStyle(
                  context,
                  color: MVTheme.primaryColor,
                  fontSize: 18,
                  weight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ),
      ),
    ]);
  }
}
