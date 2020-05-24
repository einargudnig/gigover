import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/routes/RouteObserver.dart';
import 'package:provider/provider.dart';

final RouteObserverHelper routeObserver = new RouteObserverHelper();

class NestedNavigator extends StatefulWidget {
  final GlobalKey<NavigatorState> navigationKey;
  final String initialRoute;
  final Map<String, WidgetBuilder> routes;

  NestedNavigator({
    @required this.navigationKey,
    @required this.initialRoute,
    @required this.routes,
  });

  NestedNavigatorState createState() => NestedNavigatorState();
}

class NestedNavigatorState extends State<NestedNavigator> with RouteAware {
  NestedNavigatorState({ Key key });

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

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      child: Navigator(
        observers: [routeObserver],
        key: widget.navigationKey,
        initialRoute: widget.initialRoute,
        onGenerateRoute: (RouteSettings routeSettings) {
          WidgetBuilder builder = widget.routes[routeSettings.name];
          print(routeSettings.name);
          print(widget.routes);
          if (routeSettings.isInitialRoute) {
            return PageRouteBuilder(
              pageBuilder: (context, __, ___) => builder(context),
              settings: routeSettings,
            );
          } else {
            return MaterialPageRoute(
              builder: builder,
              settings: routeSettings,
            );
          }
        },
      ),
      onWillPop: () {
        String currentRoute = ModalRoute.of(context).settings.name;
        if(currentRoute == '/' || currentRoute == '/project') {
          HomeProvider homeProvider =
          Provider.of<HomeProvider>(context, listen: false);
          homeProvider.showTimePanel();
        }
        if(widget.navigationKey.currentState.canPop()) {
          widget.navigationKey.currentState.pop();
          return Future<bool>.value(false);
        }
        return Future<bool>.value(true);
      },
    );
  }

}