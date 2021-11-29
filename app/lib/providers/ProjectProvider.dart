import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:mittverk/models/Task.dart';
import 'package:mittverk/services/ApiService.dart';

class ProjectProvider with ChangeNotifier {
  bool _loadingTasks = true;
  String? _taskError;
  List<Task?> _tasks = [];

  List<Task?> get tasks => _tasks;

  void updateTask(Task? task) {
    int taskIndex = this._tasks.indexWhere((Task? t) {
      return t!.taskId == task!.taskId;
    });
    //TODO update task

    print(taskIndex);
    print('------------------------');
    if (taskIndex != null) {
      this._tasks[taskIndex] = task;
    }
    notifyListeners();
  }

  void getTasks(int? projectId) async {
    Response response = await ApiService.getProjectTaskList(projectId);

    print('Getting tasks..');

    if (response.statusCode != 200) {
      setError(
          'Error came up while fetching task list for project ${projectId}');
    } else {
      try {
        if (response.data != null && response.data["projectTasks"] != null) {
          dynamic projectTasks = response.data["projectTasks"];

          print('Got tasks!');
          print(projectTasks[0]);

          List<Task?> tempTasks = [];

          projectTasks.forEach((task) {
            tempTasks.add(Task.fromJson(task));
          });

          _tasks = tempTasks;
          notifyListeners();
        } else {
          setError('No tasks available');
        }
      } catch (e) {
        print('rassgat');
        print("ERROR WHILE PARSING PROJECTS");
        setError('Could not load projects');
      }
    }

    _loadingTasks = false;
    notifyListeners();
  }

  void setError(String error) {
    _taskError = error;
    notifyListeners();
  }
}
