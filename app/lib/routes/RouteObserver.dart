import 'package:flutter/material.dart';

class RouteObserverHelper extends RouteObserver<PageRoute<dynamic>> {
  var screenName = "";
  var previousScreenName = "";

  void _sendScreenView(
      PageRoute<dynamic> route, PageRoute<dynamic> previousRoute) {
    print('SEND SCREEN VIEW');
    this.screenName = route.settings.name;
    if (previousRoute != null) {
      this.previousScreenName = previousRoute.settings.name;
    }
  }

  @override
  void didPush(Route<dynamic> route, Route<dynamic> previousRoute) {
    super.didPush(route, previousRoute);
    if (route is PageRoute && previousRoute is PageRoute) {
      _sendScreenView(route, previousRoute);
    }
  }

  @override
  void didReplace({Route<dynamic> newRoute, Route<dynamic> oldRoute}) {
    super.didReplace(newRoute: newRoute, oldRoute: oldRoute);
    if (newRoute is PageRoute && oldRoute is PageRoute) {
      _sendScreenView(newRoute, oldRoute);
    }
  }

  @override
  void didPop(Route<dynamic> route, Route<dynamic> previousRoute) {
    super.didPop(route, previousRoute);
    if (previousRoute is PageRoute && route is PageRoute) {
      _sendScreenView(previousRoute, route);
    }
  }
}
