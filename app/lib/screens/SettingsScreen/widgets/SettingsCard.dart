import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/RoundedButton.dart';
import 'package:mittverk/main.dart';
import 'package:mittverk/providers/AuthProvider.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/CardBox.dart';
import 'package:provider/provider.dart';

class SettingsCard extends StatefulWidget {
  AuthProvider authProvider;

  SettingsCard(this.authProvider);

  @override
  State createState() => SettingsCardState();
}

class SettingsCardState extends State<SettingsCard> {
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
    HomeProvider homeProvider =
        Provider.of<HomeProvider>(context, listen: true);

    return CardBox(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('About the app',
                style: AvailableFonts.getTextStyle(context,
                    weight: FontWeight.bold, fontSize: 16)),
            Divider(height: 24),
            Text('Gigover project manager app version 2.0.8'),
            Divider(height: 24),
            Text('Logged in with phone number:', style: AvailableFonts.getTextStyle(context,
                weight: FontWeight.bold, fontSize: 14)),
            SizedBox(height: 4),
            Text(widget.authProvider.getUser()!.phoneNumber!),
            Divider(height: 24),
            RoundedButton(
              fillBackground: Colors.black,
              textColor: Colors.white,
              text: 'Back to projects',
              onTap: () async {
                homeProvider.homeNavigationKey.currentState!.pop();
              },
            ),
            SizedBox(height: 16),
            RoundedButton(
              fillBackground: MVTheme.secondaryColor,
              textColor: MVTheme.primaryColor,
              text: 'Logout',
              onTap: () async {
                await widget.authProvider.logout();
                mainNavigatorKey.currentState!.pushReplacementNamed('/login');
              },
            ),
          ],
        ),
      ),
    );
  }
}
