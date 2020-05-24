import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/igital/utils/AvailableFonts.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/models/Task.dart';
import 'package:mittverk/models/TaskStatus.dart';
import 'package:mittverk/screens/HomeScreen/widgets/ProjectCard.dart';
import 'package:mittverk/services/ApiService.dart';
import 'package:mittverk/utils/Theme.dart';
import 'package:mittverk/widgets/TaskCard.dart';
import 'package:mittverk/igital/extensions/num_extensions.dart';

class ProjectListScreenArgs {
  Project project;

  ProjectListScreenArgs(this.project);
}

class ProjectScreen extends StatefulWidget {
  Project project;

  ProjectScreen(BuildContext context) {
    final ProjectListScreenArgs args = ModalRoute.of(context).settings.arguments;
    this.project = args.project;
  }

  @override
  State createState() => ProjectScreenState();
}

class ProjectScreenState extends State<ProjectScreen> {
  bool _loadingTasks = true;
  String _taskError;
  List<Task> _tasks = [];

  @override
  void initState() {
    super.initState();

    getTasks();
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

  void setError(String error) {
    setState(() {
      _taskError = error;
    });
  }

  void getTasks() async {
    Response response = await ApiService.getProjectTaskList(widget.project.projectId);

    print('Getting tasks..');

    if (response.statusCode != 200) {
      setError('Error came up while fetching task list for project ${widget.project.toString()}');
    } else {
      try {
        if (response.data != null && response.data["projectTasks"] != null) {
          dynamic projectTasks = response.data["projectTasks"];

          print('Got tasks!');
          print(projectTasks[0]);

          List<Task> tempTasks = [];

          projectTasks.forEach((task) {
            tempTasks.add(Task.fromJson(task));
          });

          setState(() {
            _tasks = tempTasks;
          });
        } else {
          setError('No tasks available');
        }
      } catch (e) {
        print("ERROR WHILE PARSING PROJECTS");
        setError('Could not load projects');
      }
    }

    setState(() {
      _loadingTasks = false;
    });
  }



  List<Widget> getTaskWidgets(TaskStatus status) {
    List<Task> tasksForStatus = _tasks != null && _tasks.length > 0 ? _tasks.where((t) => t.status == status).toList() : [];

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
