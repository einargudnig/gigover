import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/widgets/ScreenLayout.dart';

class HomeScreen extends StatefulWidget {
    @override
    State createState() => HomeScreenState();
}

class HomeScreenState extends State<HomeScreen> {

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
      return ScreenLayout(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text('Home screen ish', style: AvailableFonts.getTextStyle(context, color: Colors.white)),
            CupertinoButton(
              onPressed: () {
                Navigator.pushNamed(context, '/');
              },
              child: Text('Hello world 2'),
            )
          ],
        ),
      );
    }
}