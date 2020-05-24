import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/routes/RouteObserver.dart';
import 'package:provider/provider.dart';


class NestedNavigator extends StatefulWidget {
  final RouteObserverHelper routeObserver;
  final GlobalKey<NavigatorState> navigationKey;
  final String initialRoute;
  final Map<String, WidgetBuilder> routes;

  NestedNavigator({
    @required this.routeObserver,
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
    widget.routeObserver.subscribe(this, ModalRoute.of(context));
  }

  @override
  void dispose() {
    widget.routeObserver.unsubscribe(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<HomeProvider>(
      builder: (context, homeProvider, child) {


        return WillPopScope(
          child: Navigator(
            observers: [widget.routeObserver],
            key: widget.navigationKey,
            initialRoute: widget.initialRoute,
            onGenerateRoute: (RouteSettings routeSettings) {
              WidgetBuilder builder = widget.routes[routeSettings.name];
              return MaterialPageRoute(
                builder: builder,
                settings: routeSettings,
              );
            },
          ),
          onWillPop: () {
            if(widget.navigationKey.currentState.canPop()) {
              widget.navigationKey.currentState.pop();
              return Future<bool>.value(false);
            }
            return Future<bool>.value(true);
          },
        );
      }
    );
  }

}