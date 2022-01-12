import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/ScaleFactor.dart';
import 'package:mittverk/igital/widgets/IgitalScrollBehaviour.dart';
import 'package:mittverk/igital/widgets/NestedNavigator.dart';
import 'package:mittverk/notification.dart';
import 'package:mittverk/providers/AuthProvider.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/providers/ProjectProvider.dart';
import 'package:mittverk/routes/RouteObserver.dart';
import 'package:mittverk/screens/HomeScreen/widgets/TimeTracker.dart';
import 'package:mittverk/screens/HomeScreen/TaskDetailsScreen.dart';
import 'package:mittverk/screens/SettingsScreen/SettingsScreen.dart';
import 'package:mittverk/screens/SignupScreen/SignupScreen.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/AppBar/MittVerkAppBar.dart';
import 'package:mittverk/widgets/FullscreenLoader.dart';
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
        ),
        ChangeNotifierProvider<ProjectProvider>(
          create: (context) => ProjectProvider(),
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
  late FCM firebaseMessaging;
  String notificationTitle = 'No Title';
  String notificationBody = 'No Body';
  String notificationData = 'No Data';

  _changeData(String msg) => setState(() => notificationData = msg);
  _changeBody(String msg) => setState(() => notificationBody = msg);
  _changeTitle(String msg) => setState(() => notificationTitle = msg);

  @override
  void initState() {
    firebaseMessaging = FCM();
    firebaseMessaging.setNotifications();

    firebaseMessaging.streamCtlr.stream.listen(_changeData);
    firebaseMessaging.bodyCtlr.stream.listen(_changeBody);
    firebaseMessaging.titleCtlr.stream.listen(_changeTitle);
    
    setPushNotificationToken();

    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
  }

  @override
  void dispose() {
    super.dispose();
  }
  
  void setPushNotificationToken() {
    HomeProvider homeProvider = Provider.of<HomeProvider>(context, listen: false);
    
    homeProvider.verifyUser().then((value) {
      firebaseMessaging.setUserIdAndPushToken();
    });
    
  }

  // TODO FIXXX
  Widget splashScreen(Widget child) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      builder: (context, child) {
        return ScrollConfiguration(
          behavior: IgitalScrollBehaviour(),
          child: child!,
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
      return FullscreenLoader();
    }

    if (!homeProvider.loadingVerifiedUser &&
        homeProvider.errorVerifiedUser != null) {
      // TODO Full screen error
      return Container(
        child: Text(homeProvider.errorVerifiedUser!),
      );
    }
    
    final bottomPadding = MediaQuery.of(context).padding.bottom;

    SlidePanelConfig config = homeProvider.slidePanelConfig;
    return ScreenLayout(
      child: SlidingUpPanel(
        controller: homeProvider.panelController,
        renderPanelSheet: config.renderPanelSheet!,
        minHeight: config.minHeight! + bottomPadding,
        maxHeight: config.maxHeight! + bottomPadding,
        isDraggable: config.isDraggable!,
        backdropEnabled: config.backdropEnabled!,
        panel: TimeTracker(),
        body: Scaffold(
          appBar: MittVerkAppBar(
              navigationSettings: homeProvider.navigationSettings,
              onBack: () {
                if (homeProvider.homeNavigationKey.currentState!.canPop()) {
                  homeProvider.homeNavigationKey.currentState!.pop();
                }
              },
              onSettings: () {
                homeProvider.homeNavigationKey.currentState!
                    .pushNamed('/settings');
              }),
          body: NestedNavigator(
            routeObserver: RouteObserverHelper(homeProvider: homeProvider),
            navigationKey: homeProvider.homeNavigationKey,
            initialRoute:
                // TODO REMOVE Settings as initial
                homeProvider.verifiedUser!.registered! ? '/' : '/signup',
            routes: {
              // default route as '/' is necessary!
              '/': (context) => ProjectListScreen(),
              '/signup': (context) => SignupScreen(),
              '/settings': (context) => SettingsScreen(),
              '/project': (context) => ProjectScreen(context),
              '/task': (context) => TaskDetailsView(context),
            },
          ),
        ),
      ),
    );
  }
}
