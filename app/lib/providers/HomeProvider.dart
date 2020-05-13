import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/models/Task.dart';
import 'package:mittverk/models/VerifyUser.dart';
import 'package:mittverk/providers/AuthProvider.dart';
import 'package:mittverk/providers/StopwatchProvider.dart';
import 'package:mittverk/screens/HomeScreen/TaskDetailsScreen.dart';
import 'package:mittverk/services/ApiService.dart';
import 'package:provider/provider.dart';
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

class TimerItem {
  String dateStarted;
  String id;
  String dateFinished;
}

enum StopWatchStatus { OnGoing, Paused, Stopped, Idle }

class StopWatchData {
  Project currentProject;
  Task currentTask;
  StopWatchStatus stopWatchStatus;
  List<TimerItem> timerItems;

  StopWatchData(this.currentProject, this.currentTask, this.stopWatchStatus,
      this.timerItems);
}

class HomeProvider with ChangeNotifier {
  final GlobalKey<NavigatorState> homeNavigationKey =
      GlobalKey<NavigatorState>();

  int _count = 0;

  bool loadingUserVerification = true;

  String projectsError;
  bool loadingProjects = true;
  List<Project> projects = [];

  Project currentTrackedProject;
  Task currentTrackedTask;
  StopwatchProvider stopwatch;
  SlidePanelConfig slidePanelConfig = defaultSlidePanelConfig;
  PanelController panelController = new PanelController();
  StopWatchData stopWatchData;

  IdTokenResult userToken;
  VerifyUser verifiedUser;
  bool loadingVerifiedUser = true;
  String errorVerifiedUser;

  int get count => _count;

  bool mama = true;

  HomeProvider(IdTokenResult userToken) {
    this.userToken = userToken;
    this.stopwatch = new StopwatchProvider();
    //TODI if slidepanelConfig/timer starttimer and set the slidepanelConfig

    // Load projects
    //    this.getProjects().then((v) {
    //      this.getStopWatchData();
    //    });

    this.verifyUser().then((user) {
      verifiedUser = user;

      if (user.registered) {
        this.getProjects().then((v) {
          this.getStopWatchData();
        });
      }
    }).catchError((err) {
      errorVerifiedUser = err.toString();
      notifyListeners();
    });

  }

  Future<VerifyUser> verifyUser() async {
    if (userToken != null) {
      Response response = await ApiService.verifyUser(userToken.token);

      try {
        verifiedUser = VerifyUser.fromJson(response.data);
        return verifiedUser;
      } catch(e) {
        print(e);
        throw new Exception("Could not verify user");
      } finally {
        loadingVerifiedUser = false;
        notifyListeners();
      }
    }

    throw new Exception("User token not available");
  }

  //TIMER STUFF
  void getStopWatchData() {
    //TODO do API call to fetch the stopWatchDetails

    this.stopWatchData =
        new StopWatchData(null, null, StopWatchStatus.OnGoing, null);

    //TODO calculate the stopwatch data here to change the stopWatch
    if (this.stopWatchData.stopWatchStatus == StopWatchStatus.Idle) {
      //TODO do nothing
    } else {
      //Calculate current time from the stopwatch data
      //TODO this from API
      int minutes = 30;
      int seconds = 30;
      int hundreds = 30;

      ElapsedTime elapsedTime = new ElapsedTime(
        hundreds: hundreds,
        seconds: seconds,
        minutes: minutes,
      );
      Duration duration = new Duration(
          minutes: minutes, seconds: seconds, milliseconds: hundreds);

      //Set the time from the time instance from the server
      this.stopwatch.setAddedTime(elapsedTime, duration);

      //Start the timer if needed
      if (this.stopWatchData.stopWatchStatus == StopWatchStatus.OnGoing) {
        this.resumeTimer();
      }

      //Make sure the showSlidePanel is open, since there is a timer active
      this.showSlidePanel();
    }
    notifyListeners();
  }

  //

  void clearErrors() {
    this.projectsError = '';
  }

  Future<String> getProjects() async {
    Response response = await ApiService.projectList();

    Response res2 = await ApiService.getUserDetails();
    print(res2);
    print('Getting projects..');

    if (response.statusCode != 200) {
      projectsError = 'Error came up while fetching projects';
      print('error');
      return 'error';
    } else {
      print('herna');
      try {
        print(response.data);
        if (response.data != null && response.data["projects"] != null) {
          List<Project> projectsMapped =
              response.data["projects"].map<Project>((p) {
            return Project.fromJson(p);
          }).toList();

          print('Got projects!');
          this.projects = projectsMapped;
          print(this.projects[0]);
          print(response.data["projects"]);
          this.setCurrentProject(this.projects[0]);

          this.clearErrors();
          /*

          projects.forEach((project) {
            this.projects.add(Project.fromJson(project));
          });*/

        } else {
          projectsError = 'No projects available';
        }
      } catch (e) {
        print("ERROR WHILE PARSING PROJECTS");
        print(e);
        projectsError = 'Could not load projects';
      }
    }

    loadingProjects = false;
    notifyListeners();
    //TODO this better
    return 'done';
  }

  void setCurrentProject(Project project) {
    this.currentTrackedProject = project;
    this.currentTrackedTask =
        project.tasks.length > 0 ? project.tasks[0] : null;
    notifyListeners();
  }

  void setCurrentTask(Task task) {
    this.currentTrackedTask = task;
    notifyListeners();
  }

  ///TIMMMMER STUFF
  void showSlidePanel() {
    this.slidePanelConfig = activeSlidePanelConfig;
  }

  void pauseTimer() {
    this.stopwatch.stopStopWatch();
    notifyListeners();
  }

  void resumeTimer() {
    this.showSlidePanel();
    this.stopwatch.startStopWatch(() {
      notifyListeners();
    });
    notifyListeners();
  }

  void startTimer() {
    this.showSlidePanel();
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
