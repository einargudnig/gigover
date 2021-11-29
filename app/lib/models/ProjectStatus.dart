enum ProjectStatus {
  OPEN,
  CLOSED,
  DONE,
  UNKNOWN,
}

ProjectStatus getProjectStatusFromString(String? status) {
  switch (status) {
    case "OPEN": return ProjectStatus.OPEN;
    case "CLOSED": return ProjectStatus.CLOSED;
    case "DONE": return ProjectStatus.DONE;
  }

  return ProjectStatus.UNKNOWN;
}

String? getProjectStatus(ProjectStatus status) {
  switch (status) {
    case ProjectStatus.OPEN: return "OPEN";
    case ProjectStatus.CLOSED: return "CLOSED";
    case ProjectStatus.DONE: return "DONE";

    // SHOULD NEVER HAPPEN.
    case ProjectStatus.UNKNOWN: return "UNKNOWN";
  }

  return null;
}