import 'package:fluro/fluro.dart';
import 'package:flutter/cupertino.dart';
import 'package:mittverk/screens/HomeScreen/HomeScreen.dart';
import 'package:mittverk/screens/LoginScreen/LoginScreen.dart';

var rootHandler = Handler(handlerFunc: (BuildContext context, Map<String, dynamic> params) {
  // if loggin
  // if not ...

  return LoginScreen();
});

var homeScreenHandler = Handler(handlerFunc: (BuildContext context, Map<String, dynamic> params) {
  // if not ...

  return HomeScreen();
});