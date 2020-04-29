import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/widgets/NestedNavigator.dart';
import 'package:mittverk/igital/widgets/RoundedButton.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/screens/HomeScreen/widgets/ProjectList.dart';
import 'package:mittverk/screens/HomeScreen/widgets/TimeTracker.dart';
import 'package:mittverk/widgets/ScreenLayout.dart';
import 'package:provider/provider.dart';
import 'package:sliding_up_panel/sliding_up_panel.dart';

import 'ProjectScreen.dart';

class HomeScreen extends StatelessWidget {
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<HomeProvider>(
            create: (context) => HomeProvider())
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
  final GlobalKey<NavigatorState> navigationKey = GlobalKey<NavigatorState>();

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
    HomeProvider homeProvider =
        Provider.of<HomeProvider>(context, listen: true);

    /*Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        return Container(
            child: Text(authProvider.getUser().uid)
        );
      },
    ),*/
    SlidePanelConfig config = homeProvider.slidePanelConfig;
    return ScreenLayout(
      child: SlidingUpPanel(
        controller: homeProvider.panelController,
        renderPanelSheet: config.renderPanelSheet,
        minHeight: config.minHeight,
        maxHeight: config.maxHeight,
        isDraggable: config.isDraggable,
        backdropEnabled: config.backdropEnabled,
        panel: TimeTracker(),
        body: NestedNavigator(
          navigationKey: navigationKey,
          initialRoute: '/',
          routes: {
            // default route as '/' is necessary!
            '/': (context) => ProjectList(),
            '/project': (context) => ProjectScreen(),
          },
        ),
      ),
    );
  }
}
