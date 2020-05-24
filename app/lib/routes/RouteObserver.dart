import 'package:flutter/material.dart';
import 'package:mittverk/providers/HomeProvider.dart';

class RouteObserverHelper extends RouteObserver<PageRoute<dynamic>> {
  HomeProvider homeProvider;
  List<Route<dynamic>> routeStack = List();

  RouteObserverHelper({ this.homeProvider });

  var screenName = "";
  var previousScreenName = "";

  void _sendScreenView(
      PageRoute<dynamic> route, PageRoute<dynamic> previousRoute) {
    this.screenName = route.settings.name;

    if(screenName == '/' || screenName == '/project') {
      homeProvider.showTimePanel();
    } else {
      homeProvider.hideTimePanel();
    }

    print('==== New screen view: $screenName ====');

    if (previousRoute != null) {
      this.previousScreenName = previousRoute.settings.name;
      print('==== From screen: $previousScreenName ====');
    }
  }

  void removeLast() {
    if (routeStack.length > 0) {
      routeStack.removeLast();
    }
  }

  @override
  void didPush(Route<dynamic> route, Route<dynamic> previousRoute) {
    super.didPush(route, previousRoute);
    routeStack.add(route);

    if (route is PageRoute && previousRoute is PageRoute) {
      _sendScreenView(route, previousRoute);
    }
  }

  @override
  void didReplace({Route<dynamic> newRoute, Route<dynamic> oldRoute}) {
    super.didReplace(newRoute: newRoute, oldRoute: oldRoute);
    removeLast();
    routeStack.add(newRoute);

    if (newRoute is PageRoute && oldRoute is PageRoute) {
      _sendScreenView(newRoute, oldRoute);
    }
  }

  @override
  void didPop(Route<dynamic> route, Route<dynamic> previousRoute) {
    super.didPop(route, previousRoute);
    removeLast();

    if (previousRoute is PageRoute && route is PageRoute) {
      _sendScreenView(previousRoute, route);
    }
  }

  @override
  void didRemove(Route route, Route previousRoute) {
    removeLast();

    if (previousRoute is PageRoute && route is PageRoute) {
      _sendScreenView(previousRoute, route);
    }
  }

}
