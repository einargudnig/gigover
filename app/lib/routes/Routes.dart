import 'dart:developer';

import 'package:fluro/fluro.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/routes/Handlers.dart';

class Routes {
  static String root = '/';
  static String settings = '/settings';
  static String home = '/home';
  static String taskDetails = '/taskDetails/:id';

  static void configureRoutes(Router router) {
    router.notFoundHandler = Handler(
        handlerFunc: (BuildContext context, Map<String, List<String>> params) {
          log('Route not found.');
          log(params.toString());

          throw new Exception('No handler assigned to a route, look at logs');
        }
    );

    router.define(root, handler: rootHandler, transitionType: TransitionType.fadeIn);
    router.define(home, handler: homeScreenHandler, transitionType: TransitionType.cupertino);
    router.define(settings, handler: settingsScreenHandler, transitionType: TransitionType.cupertino);
    router.define(taskDetails, handler: taskDetailsHandler, transitionType: TransitionType.cupertino);
  }
}