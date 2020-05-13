import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/ScaleFactor.dart';
import 'package:mittverk/igital/widgets/IgitalScrollBehaviour.dart';
import 'package:mittverk/igital/widgets/NestedNavigator.dart';
import 'package:mittverk/main.dart';
import 'package:mittverk/models/VerifyUser.dart';
import 'package:mittverk/providers/AuthProvider.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/screens/HomeScreen/widgets/TimeTracker.dart';
import 'package:mittverk/screens/HomeScreen/TaskDetailsScreen.dart';
import 'package:mittverk/screens/SettingsScreen/SettingsScreen.dart';
import 'package:mittverk/screens/SignupScreen/SignupScreen.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/AppBar/MittVerkAppBar.dart';
import 'package:mittverk/widgets/ScreenLayout.dart';
import 'package:provider/provider.dart';
import 'package:sliding_up_panel/sliding_up_panel.dart';
import 'ProjectListScreen.dart';
import 'ProjectScreen.dart';

class HomeScreen extends StatelessWidget {
  Widget build(BuildContext context) {
    AuthProvider authProvider =
        Provider.of<AuthProvider>(context, listen: true);

    print('AUTH TOKEN: ${authProvider.userToken}');
    if (authProvider.userToken == null) {
      return Container();
    }

    return MultiProvider(
      providers: [
        ChangeNotifierProvider<HomeProvider>(
          create: (context) => HomeProvider(authProvider.userToken),
        )
      ],
      child: HomeScreenView(),
    );
  }
}

class HomeScreenView extends StatefulWidget {
  @override
  State createState() => HomeScreenViewState();
}

class HomeScreenViewState extends State<HomeScreenView> with RouteAware {
  @override
  void initState() {
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    routeObserver.subscribe(this, ModalRoute.of(context));
  }

  @override
  void dispose() {
    routeObserver.unsubscribe(this);
    super.dispose();
  }

  // TODO FIXXX
  Widget splashScreen(Widget child) {
    return MaterialApp(
      builder: (context, child) {
        return ScrollConfiguration(
          behavior: IgitalScrollBehaviour(),
          child: child,
        );
      },
      home: Container(
        decoration: BoxDecoration(
          color: MVTheme.primaryColor,
        ),
        child: Center(
          child: child,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    ScaleFactor(context);

    HomeProvider homeProvider =
        Provider.of<HomeProvider>(context, listen: true);

    if (homeProvider.loadingVerifiedUser) {
      return Container(
        child: Text('Loading')
      );
    }

    if (!homeProvider.loadingVerifiedUser && homeProvider.errorVerifiedUser != null) {
      return Container(
        child: Text(homeProvider.errorVerifiedUser),
      );
    }

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
        body: Scaffold(
          appBar: MittVerkAppBar(
            onBack: () {
              homeProvider.homeNavigationKey.currentState.pop();
            },
            onSettings: () {
              homeProvider.homeNavigationKey.currentState.pushNamed('/settings');
            }
          ),
          body: NestedNavigator(
            navigationKey: homeProvider.homeNavigationKey,
            initialRoute: homeProvider.verifiedUser.registered ? '/' : '/signup',
            routes: {
              // default route as '/' is necessary!
              '/': (context) => ProjectListScreen(),
              '/signup': (context) => SignupScreen(),
              '/project': (context) => ProjectScreen(context),
              '/settings': (context) => SettingsScreen(),
              '/task': (context) => TaskDetailsView(context),
            },
          ),
        ),
      ),
    );
  }
}
