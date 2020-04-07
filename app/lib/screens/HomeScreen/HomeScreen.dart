import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/screens/HomeScreen/widgets/ProjectList.dart';
import 'package:mittverk/widgets/ScreenLayout.dart';
import 'package:provider/provider.dart';

class HomeScreen extends StatelessWidget {
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<HomeProvider>(create: (_) => HomeProvider()),
      ],
      child: HomeScreenView(),
    );
  }
}

class HomeScreenView extends StatefulWidget {
  @override
  State createState() => HomeScreenViewState();
}

class HomeScreenViewState extends State<HomeScreenView> {
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
    final homeProvider = Provider.of<HomeProvider>(context);

    return ScreenLayout(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ProjectList(),
            CupertinoButton(
              onPressed: () {
                homeProvider.increment();
              },
              color: Colors.green,
              child: Text('Timaskraning baby'),
            )
          ],
        ),
      ),
    );
  }
}
