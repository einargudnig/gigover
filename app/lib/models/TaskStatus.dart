enum TaskStatus {
  Backlog,
  Todo,
  Doing,
  Done,
}

String getTaskStatusString(TaskStatus status) {
  switch (status) {
    case TaskStatus.Backlog: return "Backlog";
    case TaskStatus.Todo: return "To do";
    case TaskStatus.Doing: return "Doing";
    case TaskStatus.Done: return "Done";
  }

  return null;
}