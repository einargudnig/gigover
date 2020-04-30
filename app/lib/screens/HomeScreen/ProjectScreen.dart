import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/igital/widgets/DebugBorder.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/screens/HomeScreen/widgets/ProjectCard.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:provider/provider.dart';

class ProjectScreenArguments {
  Project project;

  ProjectScreenArguments(this.project);
}

class ProjectScreen extends StatefulWidget {
  @override
  State createState() => ProjectScreenState();
}

class ProjectScreenState extends State<ProjectScreen> {
  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  Widget tabs() {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.only(top: 2.0),
        child: DefaultTabController(
          length: 3,
          child: Scaffold(
            backgroundColor: Colors.white,
            appBar: TabBar(
              isScrollable: true,
              indicatorColor: MVTheme.secondaryColor,
              tabs: [
                Tab(
                    child: Text(
                  'Hello world',
                  style: AvailableFonts.getTextStyle(context,
                      color: MVTheme.mainFont, weight: FontWeight.bold),
                )),
                Tab(
                    child: Text(
                  'Hello world',
                  style: AvailableFonts.getTextStyle(context,
                      color: MVTheme.mainFont, weight: FontWeight.bold),
                )),
                Tab(
                    child: Text(
                      'Hello world',
                      style: AvailableFonts.getTextStyle(context,
                          color: MVTheme.mainFont, weight: FontWeight.bold),
                    )),
              ],
            ),
            body: DebugBorder(
              child: Container(
                height: 40,
                decoration: BoxDecoration(color: MVTheme.backgroundLightGray),
                child: TabBarView(
                  children: [
                    Center(child: Text('Hello')),
                    Icon(Icons.directions_transit),
                    Icon(Icons.directions_bike),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final ProjectScreenArguments args =
        ModalRoute.of(context).settings.arguments;

    print('Project with id:');
    Project project = args.project;
    print(project.id);

    return Container(
      decoration: BoxDecoration(color: MVTheme.backgroundLightGray),
      child: Column(
        children: <Widget>[
          ProjectCard(item: args.project, borderRadius: 0),
          tabs(),
        ],
      ),
    );
  }
}
