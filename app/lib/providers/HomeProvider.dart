import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/models/Task.dart';
import 'package:mittverk/providers/StopwatchProvider.dart';
import 'package:mittverk/screens/HomeScreen/TaskDetailsScreen.dart';
import 'package:mittverk/services/ApiService.dart';
import 'package:sliding_up_panel/sliding_up_panel.dart';

class SlidePanelConfig {
  double minHeight;
  double maxHeight;
  bool renderPanelSheet;
  bool backdropEnabled;
  bool isDraggable;

  bool isCollapsed;

  SlidePanelConfig(
      {this.minHeight,
      this.maxHeight,
      this.renderPanelSheet,
      this.backdropEnabled,
      this.isDraggable,
      this.isCollapsed});
}

SlidePanelConfig defaultSlidePanelConfig = new SlidePanelConfig(
    minHeight: 72,
    maxHeight: 72,
    isDraggable: false,
    backdropEnabled: false,
    renderPanelSheet: false,
    isCollapsed: true);

SlidePanelConfig activeSlidePanelConfig = new SlidePanelConfig(
    minHeight: 70,
    maxHeight: 170,
    isDraggable: true,
    backdropEnabled: false,
    renderPanelSheet: false,
    isCollapsed: false);

class ElapsedTime {
  final int hundreds;
  final int seconds;
  final int minutes;

  ElapsedTime({
    this.hundreds,
    this.seconds,
    this.minutes,
  });
}

class HomeProvider with ChangeNotifier {
  final GlobalKey<NavigatorState> homeNavigationKey =
      GlobalKey<NavigatorState>();

  int _count = 0;

  String projectsError;
  bool loadingProjects = true;
  List<Project> projects = [];

  Project currentTrackedProject;
  Task currentTrackedTask;
  StopwatchProvider stopwatch;
  SlidePanelConfig slidePanelConfig = defaultSlidePanelConfig;
  PanelController panelController = new PanelController();

  int get count => _count;

  bool mama = true;

  HomeProvider() {
    this.stopwatch = new StopwatchProvider();
    //TODI if slidepanelConfig/timer starttimer and set the slidepanelConfig

    // Load projects
    this.getProjects();
  }

  void getProjects() async {
    Response response = await ApiService.projectList();

    print('Getting projects..');

    if (response.statusCode != 200) {
      projectsError = 'Error came up while fetching projects';
    } else {
      try {
        if (response.data != null && response.data["projects"] != null) {
          dynamic projects = response.data["projects"];

          print('Got projects!');

          projects.forEach((project) {
            this.projects.add(Project.fromJson(project));
          });
        } else {
          projectsError = 'No projects available';
        }
      } catch (e) {
        print("ERROR WHILE PARSING PROJECTS");
        projectsError = 'Could not load projects';
      }
    }

    loadingProjects = false;
    notifyListeners();
  }

  void setCurrentProject(Project project) {
    this.currentTrackedProject = project;
    this.currentTrackedTask = project.tasks.length > 0 ? project.tasks[0] : null;
    notifyListeners();
  }

  void setCurrentTask(Task task) {
    this.currentTrackedTask = task;
    notifyListeners();
  }

  ///TIMMMMER STUFF
  void pauseTimer() {
    this.stopwatch.stopStopWatch();
    notifyListeners();
  }

  void resumeTimer() {
    this.stopwatch.startStopWatch(() {
      notifyListeners();
    });
    notifyListeners();
  }

  void startTimer() {
    this.slidePanelConfig = activeSlidePanelConfig;
    if (this.panelController.isPanelClosed) {
      this.panelController.open();
    }
    this.stopwatch.startStopWatch(() {
      notifyListeners();
    });
    notifyListeners();
  }

  void resetTimer() {
    this.stopwatch.resetStopWatch();
    this.slidePanelConfig = defaultSlidePanelConfig;
    notifyListeners();
  }

  ///TIMMMMER STUFF

  void goToTaskDetail(Task task) {
    this.hideTimePanel();
    this.homeNavigationKey.currentState.pushNamed(
          '/task',
          arguments: TaskDetailsArguments(task),
        );
  }

  void showTimePanel() {
    if (!this.panelController.isPanelShown) {
      this.panelController.show();
      notifyListeners();
    }
  }

  void hideTimePanel() {
    if (this.panelController.isPanelShown) {
      this.panelController.hide();
      notifyListeners();
    }
  }
}
