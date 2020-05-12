class TaskComment {
  int projectId;
  int taskId;
  String comment;
  String fullName;

  /// Timestamp
  int sent;

  String content;
  String userIdFrom; // userId
  String dateSent;

  TaskComment({
    this.projectId,
    this.taskId,
    this.comment,
    this.fullName,
    this.sent,
  });

  static TaskComment fromJson(Map<String, dynamic> json) {
    try {
      return TaskComment(
          taskId: json["taskId"],
          projectId: json["projectId"],
          comment: json["comment"],
          fullName: json["fullName"],
          sent: json["sent"]);
    } catch (e) {
      print('taskCommentErr');
      print(e);
      return null;
    }
  }
}
