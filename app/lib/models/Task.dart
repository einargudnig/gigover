import 'TaskComment.dart';
import 'TaskStatus.dart';

class Task {
  int taskId;
  String text;
  int typeId;
  List<TaskComment> comments = [];
  TaskStatus status;
  int projectId;
  int minutes;

  Task({
    this.taskId,
    this.text,
    this.status,
    this.typeId,
    this.comments,
    this.projectId,
    this.minutes,
  });

  static Task fromJson(Map<String, dynamic> json) {
    try {
      int statusIndex = json["status"];

      return Task(
        taskId: json["taskId"],
        projectId:
            json["project"] != null ? json["project"]["projectId"] : null,
        text: json["text"],
        status: statusIndex != -1 ? TaskStatus.values[statusIndex] : TaskStatus.Archived,
        typeId: json["typeId"],
        minutes: json["minutes"],
        comments: json["comments"] != null && json["comments"].length > 0
            ? json["comments"].map<TaskComment>((t) {
                return TaskComment.fromJson(t);
              }).toList()
            : [],
      );
    } catch (e) {
      print('error');
      print(e);
      return null;
    }
  }

  setComments(List<TaskComment> comments) {
    this.comments = comments;
  }

  // USED FOR GENERIC FUNCTIONS DO NOT REMOVE
  @override
  String toString() {
    return this.text;
  }

  void setStatus(TaskStatus status) {
    this.status = status;
  }
}
