import 'package:fluro/fluro.dart';
import 'package:flutter/material.dart';
import 'package:mittverk/routes/Routes.dart';
import 'package:mittverk/routes/RouteObserver.dart';
import 'package:mittverk/states/Application.dart';

void main() => runApp(MittVerkApp());

// global RouteObserver
final RouteObserverHelper routeObserver = new RouteObserverHelper();

class MittVerkApp extends StatefulWidget {
  @override
  State createState() => MittVerkAppState();
}

class MittVerkAppState extends State<MittVerkApp> {
  final router = Router();

  MittVerkAppState() {
    Routes.configureRoutes(router);
    Application.router = router;
  }

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
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      navigatorObservers: [routeObserver],
      theme: ThemeData(
        primaryColor: Color.fromRGBO(7, 16, 41, 1),
        backgroundColor: Color.fromRGBO(251, 251, 251, 1),
        accentColor: Color.fromRGBO(131, 136, 148, 1),
      ),
      onGenerateRoute: Application.router.generator,
    );
  }
}
