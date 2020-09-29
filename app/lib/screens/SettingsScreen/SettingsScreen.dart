import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/providers/AuthProvider.dart';
import 'package:mittverk/screens/SettingsScreen/widgets/SettingsCard.dart';
import 'package:mittverk/widgets/ScreenLayout.dart';
import 'package:provider/provider.dart';

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
        return Consumer<AuthProvider>(
          builder: (context, authProvider, child) {
            return ScreenLayout(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    SettingsCard(authProvider),
                  ],
                ),
              ),
            );
          }
        );
    }
}