import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/providers/StopwatchProvider.dart';

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
  int _count = 0;
  List<Project> projects = [
    new Project(
        title: 'Laugarásvegur 20',
        subTitle: 'Viðgerðir á klósetti',
        amountDone: 35.00,
        people: ["SEB", "TEB", "SAS"],
        daysLeft: 5),
    new Project(
        title: 'Sólvellir 8',
        subTitle: 'Parketlagning',
        amountDone: 59.00,
        people: ["SEB", "TEB"],
        daysLeft: 2)
  ];
  Project currentProject;
  Task currentTask;

  StopwatchProvider stopwatch;

  int get count => _count;

  HomeProvider() {
    this.currentProject = this.projects[0];
    this.currentTask = this.currentProject.tasks[0];
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
}
