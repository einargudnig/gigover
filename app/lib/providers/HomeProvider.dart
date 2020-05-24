import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/models/ProjectType.dart';
import 'package:mittverk/models/Task.dart';
import 'package:mittverk/models/VerifyUser.dart';
import 'package:mittverk/providers/StopwatchProvider.dart';
import 'package:mittverk/screens/HomeScreen/TaskDetailsScreen.dart';
import 'package:mittverk/services/ApiService.dart';
import 'package:mittverk/utils/NavigationSettings.dart';
import 'package:sliding_up_panel/sliding_up_panel.dart';

class SlidePanelConfig {
  double minHeight;
  double maxHeight;
  bool renderPanelSheet;
  bool backdropEnabled;
  bool isDraggable;

  bool isCollapsed;

  SlidePanelConfig({
    this.minHeight,
    this.maxHeight,
    this.renderPanelSheet,
    this.backdropEnabled,
    this.isDraggable,
    this.isCollapsed,
  });
}

SlidePanelConfig defaultSlidePanelConfig = new SlidePanelConfig(
  minHeight: 72,
  maxHeight: 72,
  isDraggable: false,
  backdropEnabled: false,
  renderPanelSheet: false,
  isCollapsed: true,
);

SlidePanelConfig activeSlidePanelConfig = new SlidePanelConfig(
  minHeight: 70,
  maxHeight: 170,
  isDraggable: true,
  backdropEnabled: false,
  renderPanelSheet: false,
  isCollapsed: false,
);

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
  List<Project> projects = List();
  List<ProjectType> projectTypes = List();

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

  NavigationSettings navigationSettings = NavigationSettings();

  HomeProvider(IdTokenResult userToken) {
    this.userToken = userToken;
    this.stopwatch = new StopwatchProvider();
    initVerifyUser();
  }

  void notifyListenersAfterNavigationSettings() {
    notifyListeners();
  }

  void initVerifyUser() {
    this.verifyUser().then((user) {
      verifiedUser = user;

      getProjectTypes();

      if (user.registered) {
        this.getProjects().then((v) {
          this.getStopWatchData().then((s) {
            if (this.currentTrackedProject == null) {
              this.setCurrentProject(this.projects[0]);
            }
          });
        });
      }
    }).catchError((err) {
      errorVerifiedUser = err.toString();
      notifyListeners();
    });
  }

  void getProjectTypes() async {
    try {
      Response response = await ApiService.getProjectTypes();
      List<ProjectType> projectsMapped =
          response.data["projectTypes"].map<ProjectType>((p) {
        return ProjectType.fromJson(p);
      }).toList();
      projectTypes = projectsMapped;
    } catch (e) {
      print(e);
      // Do nothing here, nothing major happens without ProjectTypes
    }
  }

  Future<VerifyUser> verifyUser() async {
    if (userToken != null) {
      Response response = await ApiService.verifyUser(userToken.token);

      try {
        verifiedUser = VerifyUser.fromJson(response.data);
        return verifiedUser;
      } catch (e) {
        print(e);
        throw new Exception("Could not verify user");
      } finally {
        loadingVerifiedUser = false;
        notifyListeners();
      }
    }

    throw new Exception("User token not available");
  }

  void signupCompleted() {
    // Reverify to make sure the user was registered
    initVerifyUser();
    homeNavigationKey.currentState.pushReplacementNamed('/');
  }

  //TIMER STUFF
  Future<String> getStopWatchData() async {
    //TODO do API call to fetch the stopWatchDetails

    Response response = await ApiService.getTimer();
    print(response);
    print('res');

    //If error just do nothing
    if (response.statusCode != 200) {
      this.stopwatch.resetStopWatch();
      return "Error";
    }

    if (response.data["timeSheet"] != null &&
        !response.data["timeSheet"].isEmpty) {
      // Set the data
      // Calculate current time from the stopwatch data
      Project tempP = this.projects.firstWhere((Project t) {
        return t.projectId == response.data["timeSheet"]["projectId"];
      });
      Task tempT = tempP.tasks.firstWhere((Task t) {
        return t.taskId == response.data["timeSheet"]["taskId"];
      });

      if (tempP != null) {
        this.setCurrentProject(tempP);
      }
      if (tempT != null) {
        this.setCurrentTask(tempT);
      }

      DateTime startTime = new DateTime.fromMillisecondsSinceEpoch(
          response.data["timeSheet"]["start"]);
      DateTime now = DateTime.now();

      var inMilliseconds = now.difference(startTime).inMilliseconds;

      ElapsedTime elapsedTime = new ElapsedTime(
        hundreds: inMilliseconds,
      );

      Duration duration = new Duration(milliseconds: inMilliseconds);
      // Set the time from the time instance from the server
      this.stopwatch.resetStopWatch();
      this.stopwatch.setAddedTime(elapsedTime, duration);

      this.resumeTimer();

      this.showSlidePanel();
    } else {
      this.stopwatch.resetStopWatch();
    }
    notifyListeners();
    return "done";
  }

  void clearErrors() {
    this.projectsError = '';
  }

  Future<String> getProjects() async {
    Response response = await ApiService.projectList();
    print(response);
    print('resss--');

    Response res2 = await ApiService.getUserDetails();
    print(res2);
    print('Getting projects..');

    if (response.statusCode != 200) {
      projectsError = 'Error came up while fetching projects';
      return 'error';
    } else {
      try {
        if (response.data != null && response.data["projects"] != null) {
          List<Project> projectsMapped =
              response.data["projects"].map<Project>((p) {
            return Project.fromJson(p);
          }).toList();

          print('Got projects!');
          this.projects = projectsMapped;
          this.clearErrors();
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

  Future<void> startTimer() async {
    this.showSlidePanel();
    if (this.panelController.isPanelClosed) {
      this.panelController.open();
    }

    //TODO  not posibly wait for callback
    Response res = await ApiService.workStart(
        this.currentTrackedProject.projectId,
        this.currentTrackedTask.taskId,
        1);

    this.stopwatch.startStopWatch(() {
      notifyListeners();
    });
    notifyListeners();
  }

  void resetTimer() {
    //TODO perhaps show some dialog to tell the user about the time he just logged
    //TODO and do not
    ApiService.workEnd(this.currentTrackedProject.projectId);
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
