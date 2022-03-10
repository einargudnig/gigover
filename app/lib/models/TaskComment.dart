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

    final date2 = DateTime.now();
    final difference = date2.difference(currentDate);

    if (difference.inDays > 8) {
      return dateFormat.format(currentDate);
    } else if ((difference.inDays / 7).floor() >= 1) {
      return 'Last week';
    } else if (difference.inDays >= 2) {
      return '${difference.inDays} days ago';
    } else if (difference.inDays >= 1) {
      return 'Yesterday';
    } else if (difference.inHours >= 2) {
      return '${difference.inHours} hours ago';
    } else if (difference.inHours >= 1) {
      return 'An hour ago';
    } else if (difference.inMinutes >= 2) {
      return '${difference.inMinutes} minutes ago';
    } else if (difference.inMinutes >= 1) {
      return 'A minute ago';
    } else if (difference.inSeconds >= 3) {
      return '${difference.inSeconds} seconds ago';
    } else {
      return 'Just now';
    }
  }

  static TaskComment fromJson(Map<String, dynamic> json) {
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
      throw e;
    }
  }
}
