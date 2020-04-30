import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/providers/StopwatchProvider.dart';
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
  final GlobalKey<NavigatorState> homeNavigationKey = GlobalKey<NavigatorState>();

  int _count = 0;
  List<Project> projects = [
    new Project(
        id: 1,
        title: 'Laugarásvegur 20',
        subTitle: 'Viðgerðir á klósetti',
        amountDone: 35.00,
        people: ["SEB", "TEB", "SAS"],
        daysLeft: 5),
    new Project(
        id: 2,
        title: 'Sólvellir 8',
        subTitle: 'Parketlagning',
        amountDone: 59.00,
        people: ["SEB", "TEB"],
        daysLeft: 2),
    new Project(
        id: 3,
        title: 'Sólvellir 8',
        subTitle: 'Parketlagning',
        amountDone: 59.00,
        people: ["SEB", "TEB"],
        daysLeft: 2),
    new Project(
        id: 4,
        title: 'Sólvellir 8',
        subTitle: 'Parketlagning',
        amountDone: 59.00,
        people: ["SEB", "TEB"],
        daysLeft: 2)
  ];
  Project currentProject;
  Task currentTask;
  StopwatchProvider stopwatch;
  SlidePanelConfig slidePanelConfig = defaultSlidePanelConfig;
  PanelController panelController = new PanelController();

  int get count => _count;

  bool mama = true;

  HomeProvider() {
    this.currentProject = this.projects[0];
    this.currentTask = this.currentProject.tasks[0];
    this.stopwatch = new StopwatchProvider();

    //TODI if slidepanelConfig/timer starttimer and set the slidepanelConfig
  }

  void setCurrentProject(String projectTitle) {
    Project p = projects.firstWhere((p) {
      return p.title == projectTitle;
    });
    this.currentTask = p.tasks[0];
    this.currentProject = p;
    notifyListeners();
  }

  void setCurrentTask(String taskTitle) {
    Task t = this.currentProject.tasks.firstWhere((p) {
      return p.title == taskTitle;
    });
    this.currentTask = t;
    notifyListeners();
  }

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

  void increment() {
    projects.add(new Project(
        title: 'Laugarvegur 3',
        subTitle: 'Setja upp Apple TV',
        amountDone: 10,
        people: ["SEB", "TEB", "FAF", "TS", "TS", "TS", "TS", "TS"],
        daysLeft: 7));
    notifyListeners();
  }

  void setStopwatchState(StopwatchProvider stopwatchState) {
    this.stopwatch = stopwatchState;
  }

  SlidePanelConfig getSlidePanelConfig() {
    if (stopwatch.currentStopWatchDuration == Duration.zero) {
      //Default time tracking bottom
      return new SlidePanelConfig(
          minHeight: 72,
          maxHeight: 72,
          isDraggable: false,
          backdropEnabled: false,
          renderPanelSheet: false);
    } else {
      print('returning here');
      return new SlidePanelConfig(
          minHeight: 70,
          maxHeight: 170,
          isDraggable: true,
          backdropEnabled: false,
          renderPanelSheet: true);
    }
  }
}
