import 'package:fluro/fluro.dart';
import 'package:flutter/material.dart';
import 'package:mittverk/routes/Routes.dart';
import 'package:mittverk/states/Application.dart';

void main() => runApp(MittVerkApp());

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

  Map<int, Color> getPrimarySwatch() {
    return {
      50: Color.fromRGBO(7, 16, 41, .1),
      100: Color.fromRGBO(7, 16, 41, .2),
      200: Color.fromRGBO(7, 16, 41, .3),
      300: Color.fromRGBO(7, 16, 41, .4),
      400: Color.fromRGBO(7, 16, 41, .5),
      500: Color.fromRGBO(7, 16, 41, .6),
      600: Color.fromRGBO(7, 16, 41, .7),
      700: Color.fromRGBO(7, 16, 41, .8),
      800: Color.fromRGBO(7, 16, 41, .9),
      900: Color.fromRGBO(7, 16, 41, 1),
    };
  }

  @override
  Widget build(BuildContext context) {
    MaterialColor material = MaterialColor(0xFF880E4F, getPrimarySwatch());

    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: material,
        backgroundColor: Color.fromRGBO(251, 251, 251, 1),
        accentColor: Color.fromRGBO(131, 136, 148, 1),

      ),
      onGenerateRoute: Application.router.generator,
    );
  }
}
