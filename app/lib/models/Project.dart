import 'package:mittverk/models/ProjectStatus.dart';

import 'Task.dart';
import 'TaskStatus.dart';

class Project {
  int projectId;
  String name;
  String description;
  String zipCode;
  ProjectStatus status;
  int workId;
  List<Task> tasks;

  Project(
      {this.projectId,
      this.name,
      this.description,
      this.zipCode,
      this.status,
      this.workId,
      this.tasks}) {
    if (tasks == null) {
      this.tasks = [];
    }
  }

  static Project fromJson(Map<String, dynamic> json) {
    try {
      return Project(
          projectId: json["projectId"],
          name: json["name"],
          description: json["description"],
          zipCode: json["zipCode"],
          status: getProjectStatusFromString(json["status"]),
          workId: json["workId"],
          tasks: json["tasks"] != null
              ? json["tasks"].map<Task>((t) {
                  return Task.fromJson(t);
                }).toList()
              : []);
    } catch (e) {
      return null;
    }
  }

  String get amountDonePercentage {
    return this.amountDoneValue.toString().substring(0, 2) + '%';
  }

  double get amountDoneValue {
    if (tasks.length > 0) {
      int tasksDone = 0;
      tasks.forEach((t) => tasksDone += (t.status != TaskStatus.Done ? 1 : 0));
      return (tasksDone / tasks.length) * 100;
    }

    return 0;
  }

  // USED FOR GENERIC FUNCTIONS DO NOT REMOVE
  @override
  String toString() {
    return this.name;
  }
}
