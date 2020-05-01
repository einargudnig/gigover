import 'TaskComment.dart';

class Task {
  String title;
  String id;
  List<TaskComment> comments = [];

  Task(this.id, this.title, this.comments);
}