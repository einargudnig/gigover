import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/widgets/RoundedButton.dart';
import 'package:mittverk/igital/widgets/Spacing.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/screens/HomeScreen/widgets/ProjectList.dart';
import 'package:mittverk/screens/HomeScreen/widgets/TimeTrackerDialog.dart';
import 'package:mittverk/widgets/ScreenLayout.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatelessWidget {
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<HomeProvider>(create: (_) => HomeProvider()),
      ],
      child: HomeScreenView(),
    );
  }
}

class HomeScreenView extends StatefulWidget {
  @override
  State createState() => HomeScreenViewState();
}

class HomeScreenViewState extends State<HomeScreenView> {
  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  List<Widget> homeButtons(BuildContext context) {
    final homeProvider = Provider.of<HomeProvider>(context);

    if (homeProvider.currentStopWatchDuration != Duration.zero) {
      return [
        Expanded(
          child: RoundedButton(
              padding: EdgeInsets.all(20.0),
              textColor: Color.fromRGBO(176, 189, 220, 1),
              borderColorFromTextColor: true,
              onTap: () {},
              text: homeProvider.currentStopWatchDuration.inSeconds.toString()),
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
                if (homeProvider.stopWatch.isRunning) {
                  homeProvider.stopStopWatch();
                } else {
                  homeProvider.resetStopWatch();
                }
              },
              text: homeProvider.stopWatch.isRunning ? 'Hætta' : 'Endursetja'),
        ),
      ];
    } else {
      return [
        Expanded(
          child: RoundedButton(
              padding: EdgeInsets.all(20.0),
              fillBackground: Color.fromRGBO(31, 223, 131, 1),
              textColor: Color.fromRGBO(7, 16, 41, 1),
              onTap: () {
                showCupertinoModalPopup(
                    context: context,
                    builder: (_) {
                      return ChangeNotifierProvider.value(
                          value: homeProvider, child: TimeTrackerDialog());
                    });
              },
              text: 'Tímaskráning'),
        ),
      ];
    }
  }

  @override
  Widget build(BuildContext context) {
    return ScreenLayout(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ProjectList(),
            Row(
              children: homeButtons(context),
            )
          ],
        ),
      ),
    );
  }
}
