import 'package:fluro/fluro.dart';
import 'package:flutter/cupertino.dart';
import 'package:mittverk/igital/utils/ScaleFactor.dart';
import 'package:mittverk/providers/AuthProvider.dart';
import 'package:mittverk/screens/HomeScreen/HomeScreen.dart';
import 'package:mittverk/screens/LoginScreen/LoginScreen.dart';
import 'package:mittverk/screens/ScreenAppBarWrapper.dart';
import 'package:mittverk/screens/SettingsScreen/SettingsScreen.dart';
import 'package:mittverk/screens/TaskDetailsScreen/TaskDetails.dart';
import 'package:provider/provider.dart';

void setScaleFactor(BuildContext context) {
  ScaleFactor(context);
}

var rootHandler = Handler(handlerFunc: (BuildContext context, Map<String, dynamic> params) {
  return LoginScreen();
});

// ======== AUTHENTICATED ROUTES =========
var homeScreenHandler = Handler(handlerFunc: (BuildContext context, Map<String, dynamic> params) {
  setScaleFactor(context);
  // if not ...

  return ScreenAppBarWrapper(child: HomeScreen());
});

var settingsScreenHandler = Handler(handlerFunc: (BuildContext context, Map<String, dynamic> params) {
  setScaleFactor(context);

  return ScreenAppBarWrapper(child: SettingsScreen());
});


var taskDetailsHandler = Handler(handlerFunc: (BuildContext context, Map<String, dynamic> params) {
  return ScreenAppBarWrapper(child: TaskDetailsScreen(userId: params["id"][0]));
});