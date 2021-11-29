import 'package:intl/intl.dart';

class TaskComment {
  int? projectId;
  int? taskId;
  String? comment;
  String? fullName;

  /// Timestamp
  int? sent;

  String? content;
  String? userIdFrom; // userId
  String? dateSent;

  TaskComment({
    this.projectId,
    this.taskId,
    this.comment,
    this.fullName,
    this.sent,
  });

  String get formattedDate {
    var dateFormat = new DateFormat('yyyy/MM/dd HH:mm');
    DateTime currentDate = new DateTime.fromMillisecondsSinceEpoch(this.sent!);
    Duration diff = DateTime.now().difference(currentDate);

    if (diff.inDays > 6) {
      return dateFormat.format(currentDate);
    } else {
      if (diff.inDays < 1) {
        if (diff.inHours < 1) {
          return 'Just now';
        }
        if (diff.inHours < 10) {
          return '${diff.inHours} hours ago';
        }
        return 'Today';
      }
      if (diff.inDays < 2) {
        return 'Yesterday';
      }

      return '${diff.inDays} days ago';
    }
  }

  static TaskComment? fromJson(Map<String, dynamic> json) {
    try {
      return TaskComment(
        taskId: json["taskId"],
        projectId: json["projectId"],
        comment: json["comment"],
        fullName: json["fullName"],
        sent: json["sent"],
      );
    } catch (e) {
      print('taskCommentErr');
      print(e);
      return null;
    }
  }
}
