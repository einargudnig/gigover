import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/providers/HomeProvider.dart';
import 'package:mittverk/screens/HomeScreen/widgets/ProjectCard.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/TaskCard.dart';
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
  final GlobalKey<NavigatorState> navigationKey = GlobalKey<NavigatorState>();

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  Widget paddedTask(Widget child) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(12, 12, 12, 0),
      child: child,
    );
  }

  // TODO get tasks from server
  List<Widget> getTaskItems() {
    return [
      paddedTask(TaskCard()),
      paddedTask(TaskCard()),
      paddedTask(TaskCard()),
      paddedTask(TaskCard()),
    ];
  }

  List<Widget> getTabBarViews() {
    return [
      ListView(
        children: getTaskItems(),
      ),
      ListView(
        children: getTaskItems(),
      ),
      ListView(
        children: getTaskItems(),
      ),
      ListView(
        children: getTaskItems(),
      ),
    ];
  }

  List<Tab> getTabs() {
    return [
      Tab(text: 'Backlog'),
      Tab(text: 'To do'),
      Tab(text: 'Doing'),
      Tab(text: 'Done'),
    ];
  }

  Widget tabs() {
    List<Tab> tabs = getTabs();
    List<Widget> tabBarViews = getTabBarViews();

    if (tabs.length != tabBarViews.length) {
      throw new Exception("Mismatch between tabs and tab views length");
    }

    return Expanded(
      child: Padding(
        padding: const EdgeInsets.only(top: 2.0),
        child: DefaultTabController(
          length: tabs.length,
          child: Scaffold(
            backgroundColor: Colors.white,
            appBar: TabBar(
              labelColor: MVTheme.mainFont,
              unselectedLabelColor: MVTheme.mainFont,
              labelStyle: AvailableFonts.getTextStyle(context,
                  fontSize: 14, weight: FontWeight.bold),
              unselectedLabelStyle: AvailableFonts.getTextStyle(context,
                  fontSize: 14, weight: FontWeight.normal),
              isScrollable: tabs.length > 4,
              indicatorColor: MVTheme.secondaryColor,
              tabs: tabs,
            ),
            body: Column(
              children: <Widget>[
                Expanded(
                  child: Container(
                    decoration: BoxDecoration(color: MVTheme.backgroundGray),
                    child: TabBarView(
                      children: getTabBarViews(),
                    ),
                  ),
                ),
              ],
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
      decoration: BoxDecoration(color: MVTheme.backgroundGray),
      child: Column(
        children: <Widget>[
          ProjectCard(
            item: args.project,
            borderRadius: 0,
            hasBoxShadow: false,
          ),
          tabs(),
        ],
      ),
    );
  }
}
