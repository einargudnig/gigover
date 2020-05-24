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
  int minutes;

  Project(
      {this.projectId,
      this.name,
      this.description,
      this.zipCode,
      this.status,
      this.workId,
      this.tasks,
      this.minutes}) {
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
          minutes: json["minutes"],
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
    if (this.amountDoneValue == 0) {
      return "0%";
    }

    return this.amountDoneValue.toString().substring(0, 3) + '%';
  }

  double get amountDoneValue {
    if (tasks.length > 0) {
      int tasksDone = 0;
      tasks.forEach((t) => tasksDone += (t.status == TaskStatus.Done ? 1 : 0));
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
