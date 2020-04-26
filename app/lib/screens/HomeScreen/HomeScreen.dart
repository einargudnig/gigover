import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/providers/StopwatchProvider.dart';
import 'package:mittverk/screens/HomeScreen/widgets/ProjectList.dart';
import 'package:mittverk/screens/HomeScreen/widgets/TimeTracker.dart';
import 'package:mittverk/widgets/ScreenLayout.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatelessWidget {
  Widget build(BuildContext context) {
    return MultiProvider(
        providers: [
          ChangeNotifierProvider<StopwatchProvider>(
            create: (_) => StopwatchProvider(),
          ),
        ],
        child: MultiProvider(
          providers: [
            ChangeNotifierProxyProvider<StopwatchProvider, HomeProvider>(
                create: (context) => HomeProvider(),
                update: (context, stopwatchState, homeState) {
                  homeState.setStopwatchState(stopwatchState);
                  return homeState;
                }),
          ],
          child: HomeScreenView(),
        ));
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

  @override
  Widget build(BuildContext context) {
    return ScreenLayout(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[ProjectList(), TimeTracker()],
      ),
    );
  }
}
