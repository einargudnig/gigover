import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:mittverk/models/Project.dart';

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

  Stopwatch stopWatch = Stopwatch();
  Duration currentStopWatchDuration = Duration.zero;
  Timer _timer;

  int get count => _count;

  HomeProvider() {
    this.currentProject = this.projects[0];
  }

  void _onTick(Timer timer) {
    currentStopWatchDuration = stopWatch.elapsed;

    // notify all listening widgets
    notifyListeners();
  }

  void startStopWatch() {
    if (_timer != null) return;
    stopWatch.start();

    _timer = Timer.periodic(Duration(seconds: 1), _onTick);
    currentStopWatchDuration = stopWatch.elapsed;
    notifyListeners();
  }

  void stopStopWatch() {
    _timer?.cancel();
    _timer = null;
    stopWatch.stop();
    currentStopWatchDuration = stopWatch.elapsed;
    notifyListeners();
  }

  void resetStopWatch() {
    stopStopWatch();
    stopWatch.reset();
    currentStopWatchDuration = Duration.zero;

    notifyListeners();
  }

  void setCurrentProject(String projectTitle) {
    Project p = projects.firstWhere((p) {
      return p.title == projectTitle;
    });
    this.currentProject = p;
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
}
