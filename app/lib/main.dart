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

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primarySwatch: Colors.blue,
        backgroundColor: Color.fromRGBO(251, 251, 251, 1),
      ),
      onGenerateRoute: Application.router.generator,
    );
  }
}
