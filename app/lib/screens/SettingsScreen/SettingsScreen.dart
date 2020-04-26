import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/widgets/RoundedButton.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/AppBar/MittVerkAppBar.dart';
import 'package:mittverk/widgets/ScreenLayout.dart';

class SettingsScreen extends StatefulWidget {
    @override
    State createState() => SettingsScreenState();
}

class SettingsScreenState extends State<SettingsScreen> {

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
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Text('Settings screen'),
                RoundedButton(
                  fillBackground: MVTheme.secondaryColor,
                  textColor: MVTheme.primaryColor,
                  text: 'DEV Logout',
                  onTap: () {
                    // TODO Logout and clear auth
                    Navigator.of(context).pushReplacementNamed('/');
                  },
                )
              ],
            ),
          ),
        );
    }
}