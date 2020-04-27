import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/widgets/RoundedButton.dart';
import 'package:mittverk/providers/AuthProvider.dart';
import 'package:mittverk/services/ApiService.dart';
import 'package:mittverk/utils/Theme.dart';
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
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    Text('Settings screen'),
                    RoundedButton(
                      fillBackground: MVTheme.secondaryColor,
                      textColor: MVTheme.primaryColor,
                      text: 'DEV Logout',
                      onTap: () async {
                        await authProvider.logout();
                        Navigator.of(context).pushReplacementNamed('/');
                      },
                    ),
                    RoundedButton(
                      fillBackground: MVTheme.secondaryColor,
                      textColor: MVTheme.primaryColor,
                      text: 'DEV Create project',
                      onTap: () async {
                        Response response = await ApiService.createProject();
                        print(response.data);
                        //Navigator.of(context).pushReplacementNamed('/');
                      },
                    )
                  ],
                ),
              ),
            );
          }
        );
    }
}