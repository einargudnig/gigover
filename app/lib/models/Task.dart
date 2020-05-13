import 'TaskComment.dart';
import 'TaskStatus.dart';

//    "projectTask": {
//        "taskId": 1,
//        "text": "Henda rusli",
//        "status": 0,
//        "typeId": 5,
//        "comments": [
//            {
//                "taskId": 1,
//                "comment": "my owner comment",
//                "type": 0,
//                "fullName": "Og svo framvegis",
//                "sent": 1588625338000
//            },
//            {
//                "taskId": 1,
//                "comment": "my owner comment",
//                "type": 0,
//                "fullName": "Og svo framvegis",
//                "sent": 1588670556000
//            }
//        ],
//        "project": {
//            "projectId": 909,
//            "ownerName": "Tómas Erlingsson",
//            "ownerAvatar": "https://lh6.googleusercontent.com/-M2GCfHlDcuk/AAAAAAAAAAI/AAAAAAAAARg/LDxlbUiczCQ/photo.jpg",
//            "status": "CLOSED"
//        }
//    }

class Task {
  int taskId;
  String text;
  int typeId;
  List<TaskComment> comments = [];
  TaskStatus status;
  int projectId;

  Task(
      {this.taskId,
      this.text,
      this.status,
      this.typeId,
      this.comments,
      this.projectId});

  static Task fromJson(Map<String, dynamic> json) {
    try {
      print(json["comments"]);
      return Task(
          taskId: json["taskId"],
          projectId: json["project"] != null ? json["project"]["projectId"] : null,
          text: json["text"],
          status: TaskStatus.values[json["status"]],
          typeId: json["typeId"],
          comments: json["comments"] != null && json["comments"].length > 0
              ? json["comments"].map<TaskComment>((t) {
                  return TaskComment.fromJson(t);
                }).toList()
              : []);
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
