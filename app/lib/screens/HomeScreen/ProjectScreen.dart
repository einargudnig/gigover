import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/models/Task.dart';
import 'package:mittverk/models/TaskStatus.dart';
import 'package:mittverk/providers/ProjectProvider.dart';
import 'package:mittverk/screens/HomeScreen/widgets/ProjectCard.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/TaskCard.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';
import 'package:provider/provider.dart';

class ProjectListScreenArgs {
  Project project;

  ProjectListScreenArgs(this.project);
}

class ProjectScreen extends StatefulWidget {
  Project project;

  ProjectScreen(BuildContext context) {
    final ProjectListScreenArgs args =
        ModalRoute.of(context).settings.arguments;
    this.project = args.project;
  }

  @override
  State createState() => ProjectScreenState();
}

class ProjectScreenState extends State<ProjectScreen> {
  @override
  void initState() {
    super.initState();

    final projectProvider =
        Provider.of<ProjectProvider>(context, listen: false);
    projectProvider.getTasks(widget.project.projectId);
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

  List<Widget> getTaskWidgets(TaskStatus status) {
    final projectProvider =
        Provider.of<ProjectProvider>(context, listen: false);

    final tasks = projectProvider.tasks;

    List<Task> tasksForStatus = tasks != null && tasks.length > 0
        ? tasks.where((t) => t.status == status).toList()
        : [];

    if (tasksForStatus.length == 0) {
      return [];
    }

    return tasksForStatus.map((t) {
      return paddedTask(TaskCard(t));
    }).toList();
  }

  List<Widget> getTabBarViews() {
    return [
      ListView(children: getTaskWidgets(TaskStatus.Backlog)),
      ListView(children: getTaskWidgets(TaskStatus.Todo)),
      ListView(children: getTaskWidgets(TaskStatus.Doing)),
      ListView(children: getTaskWidgets(TaskStatus.Done)),
    ];
  }

  List<Tab> getTabs() {
    return [
      Tab(text: getTaskStatusString(TaskStatus.Backlog)),
      Tab(text: getTaskStatusString(TaskStatus.Todo)),
      Tab(text: getTaskStatusString(TaskStatus.Doing)),
      Tab(text: getTaskStatusString(TaskStatus.Done)),
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
              labelStyle: AvailableFonts.getTextStyle(
                context,
                fontSize: 15.scale,
                weight: FontWeight.bold,
              ),
              unselectedLabelStyle: AvailableFonts.getTextStyle(
                context,
                fontSize: 15.scale,
                weight: FontWeight.normal,
              ),
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
    return Container(
      decoration: BoxDecoration(color: MVTheme.backgroundGray),
      child: Column(
        children: <Widget>[
          ProjectCard(
            item: widget.project,
            borderRadius: 0,
            hasBoxShadow: false,
          ),
          tabs(),
        ],
      ),
    );
  }
}
