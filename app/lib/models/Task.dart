import 'TaskComment.dart';
import 'TaskStatus.dart';

class Task {
  int taskId;
  String text;
  int typeId;
  List<TaskComment> comments = [];
  TaskStatus status;

  Task({ this.taskId, this.text, this.status, this.typeId, this.comments });

  static Task fromJson(Map<String, dynamic> json) {
    try {
      return Task(
        taskId: json["taskId"],
        text: json["text"],
        status: TaskStatus.values[json["status"]],
        typeId: json["typeId"],
      );
    } catch(e) {
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

}