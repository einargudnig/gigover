import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:mittverk/models/Project.dart';
import 'package:mittverk/models/ProjectStatus.dart';
import 'package:mittverk/models/ProjectType.dart';
import 'package:mittverk/models/Task.dart';
import 'package:mittverk/models/Timesheet.dart';
import 'package:mittverk/models/VerifyUser.dart';
import 'package:mittverk/providers/StopwatchProvider.dart';
import 'package:mittverk/screens/HomeScreen/TaskDetailsScreen.dart';
import 'package:mittverk/services/ApiService.dart';
import 'package:mittverk/utils/NavigationSettings.dart';
import 'package:sliding_up_panel/sliding_up_panel.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SlidePanelConfig {
  double? minHeight;
  double? maxHeight;
  bool? renderPanelSheet;
  bool? backdropEnabled;
  bool? isDraggable;

  bool? isCollapsed;

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
  final int? hundreds;
  final int? hours;
  final int? seconds;
  final int? minutes;

  ElapsedTime({
    this.hundreds,
    this.seconds,
    this.minutes,
    this.hours,
  });
}

class TimerItem {
  String? dateStarted;
  String? id;
  String? dateFinished;
}

enum StopWatchStatus { OnGoing, Paused, Stopped, Idle }

String currentProjectString = 'currentProject';
String currentTaskString = 'currentTask';

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
  bool _unMounted = false;

  bool get unMounted => _unMounted;

  int _count = 0;

  bool loadingUserVerification = true;

  String? projectsError;
  bool loadingProjects = true;
  List<Project> projects = [];
  List<ProjectType> projectTypes = [];
  Project? _currentTrackedProject;
  Task? _currentTrackedTask;

  // NEW Active timer
  Timesheet? currentTimer;

  // Old tracking timer variables, now used for storing the latest selected project / task
  Project? get currentTrackedProject =>
      _currentTrackedProject ?? this.projects.first;

  Task? get currentTrackedTask =>
      _currentTrackedTask ?? this.projects.first.tasks!.first;

  late StopwatchProvider stopwatch;
  SlidePanelConfig slidePanelConfig = defaultSlidePanelConfig;
  PanelController panelController = new PanelController();
  StopWatchData? stopWatchData;

  String? userToken;
  VerifyUser? verifiedUser;
  bool loadingVerifiedUser = true;
  String? errorVerifiedUser;

  int get count => _count;

  NavigationSettings navigationSettings = NavigationSettings();

  HomeProvider(String? userToken) {
    this.userToken = userToken;
    this.stopwatch = new StopwatchProvider();
    initVerifyUser();
  }

  @override
  void dispose() {
    super.dispose();
    this.stopwatch.stopStopWatch();
    _unMounted = true;
  }

  void notifyListenersAfterNavigationSettings() {
    notifyListeners();
  }

  void initVerifyUser() {
    this.verifyUser().then((user) {
      verifiedUser = user;

      getProjectTypes();

      if (user!.registered!) {
        // skoda octavia
        this.getProjects().then((v) async {
          await this.getStopWatchData();
          this.getLocalProject();
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
      print('ERROR GETTING PROJECT TYPES');
      print(e);
      // Do nothing here, nothing major happens without ProjectTypes
    }
  }

  Future<VerifyUser?> verifyUser() async {
    if (userToken != null) {
      Response response = await ApiService.verifyUser(userToken!);

      try {
        verifiedUser = VerifyUser.fromJson(response.data);
        return verifiedUser;
      } catch (e) {
        print(e);
        print("COULD NOT VERIFY HEHE");
        throw new Exception("Could not verify user");
      } finally {
        loadingVerifiedUser = false;
        notifyListeners();
      }
    }

    throw new Exception("User token not available");
  }

  void signupCompleted() {
    // Re-verify to make sure the user was registered
    initVerifyUser();
    homeNavigationKey.currentState!.pushReplacementNamed('/');
  }

  //TIMER STUFF
  Future<String> getStopWatchData() async {
    //TODO do API call to fetch the stopWatchDetails

    Response response = await ApiService.getTimer();

    //If error just do nothing
    if (response.statusCode != 200) {
      this.stopwatch.resetStopWatch();
      return "Error";
    }

    if (response.data["timeSheet"] != null &&
        !response.data["timeSheet"].isEmpty) {
      // Set the data
      // Calculate current time from the stopwatch data
      dynamic timesheetResponse = response.data["timeSheet"];

      print(response.data["timeSheet"]);
      print(timesheetResponse);

      Timesheet ts = Timesheet(
        startTime: timesheetResponse["start"],
        projectName: timesheetResponse["projectName"],
        taskSubject: timesheetResponse["taskSubject"],
        projectId: timesheetResponse["projectId"],
        taskId: timesheetResponse["taskId"],
      );
      print('TIMESHEET');
      print(ts);

      DateTime startTime = new DateTime.fromMillisecondsSinceEpoch(
        ts.startTime,
        isUtc: true,
      );
      DateTime now = DateTime.now();

      var inMilliseconds = now.difference(startTime).inMilliseconds;

      ElapsedTime elapsedTime = new ElapsedTime(
        hundreds: inMilliseconds,
      );

      Duration duration = new Duration(milliseconds: inMilliseconds);
      // Set the time from the time instance from the server
      this.stopwatch.resetStopWatch();
      this.stopwatch.setAddedTime(elapsedTime, duration);

      // Set the current timer data
      this.currentTimer = ts;
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

  Future<void> getUserDetailsForDebugging() async {
    print('GIGOVER - Fetching User Details (Debug)');
    Response res2 = await ApiService.getUserDetails();
    print(res2);
  }

  Future<String> getProjects() async {
    print('GIGOVER - Getting projects..');
    Response response = await ApiService.projectList();
    await getUserDetailsForDebugging();

    if (response.statusCode != 200) {
      projectsError = 'Error came up while fetching projects';
      return 'error';
    } else {
      try {
        if (response.data != null && response.data["projects"] != null) {
          print(response.data["projects"]);
          List<Project> projectsMapped =
              response.data["projects"].map<Project>((p) {
            return Project.fromJson(p);
          }).toList();

          print('Got projects!');
          this.projects = projectsMapped
              .where(
                  (Project? element) => element!.status != ProjectStatus.DONE)
              .toList();
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

  Future<void> setCurrentProject(
    Project project, {
    bool updateTaskValue = true,
  }) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setInt(currentProjectString, project.projectId!).then((bool success) {
      return project.projectId;
    });
    this._currentTrackedProject = project;

    if (updateTaskValue) {
      this.setCurrentTask(project.tasks!.length > 0 ? project.tasks![0] : null);
    }
    notifyListeners();
  }

  Future<Project?> getLocalProject() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    var lastProjectId = prefs.getInt(currentProjectString);
    var lastTaskId = prefs.getInt(currentTaskString);

    if (lastProjectId != null) {
      Project project = this.projects.firstWhere(
          (Project element) => element.projectId == lastProjectId,
          orElse: () => this.projects[0]);

      this.setCurrentProject(project, updateTaskValue: false);

      if (lastTaskId != null) {
        this.setCurrentTask(project.tasks!.firstWhere(
            (Task task) => task.taskId == lastTaskId,
            orElse: () => project.tasks!.first));
      }
    }
  }

  Future<void> setCurrentTask(Task? task) async {
    this._currentTrackedTask = task;
    SharedPreferences prefs = await SharedPreferences.getInstance();
    prefs.setInt(currentTaskString, task!.taskId!);

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
      if (!this.unMounted) {
        notifyListeners();
      }
    });
    notifyListeners();
  }

  Future<void> startTimer() async {
    this.showSlidePanel();
    if (this.panelController.isPanelClosed) {
      this.panelController.open();
    }

    //TODO  not posibly wait for callback
    await ApiService.workStart(
      this.currentTrackedProject!.projectId,
      this.currentTrackedTask!.taskId,
      1,
    );

    await this.getStopWatchData();
  }

  void resetTimer() {
    //TODO perhaps show some dialog to tell the user about the time he just logged
    //TODO and do not
    if (this.currentTimer != null) {
      ApiService.workEnd(this.currentTimer!.projectId);
    }
    this.currentTimer = null;
    this.stopwatch.resetStopWatch();
    this.slidePanelConfig = defaultSlidePanelConfig;
    notifyListeners();
  }

  ///TIMMMMER STUFF
  void goToTaskDetail(Task? task) {
    this.hideTimePanel();
    this.homeNavigationKey.currentState!.pushNamed(
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
