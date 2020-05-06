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
}
