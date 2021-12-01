class Timesheet {
  final int startTime;
  final int projectId;
  final int taskId;
  final String projectName;
  final String taskSubject;

  Timesheet({
    this.startTime = 0,
    this.projectId = 0,
    this.taskId = 0,
    this.projectName = '',
    this.taskSubject = '',
  });

  @override
  String toString() {
    return "{ startTime: $startTime - projectId: $projectId - taskId: $taskId - projectName: $projectName - taskSubject: $taskSubject }";
  }

}