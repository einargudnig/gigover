enum ProjectStatus {
  OPEN,
  CLOSED,
  UNKNOWN,
}

ProjectStatus getProjectStatusFromString(String status) {
  switch (status) {
    case "OPEN": return ProjectStatus.OPEN;
    case "CLOSED": return ProjectStatus.CLOSED;
  }

  return ProjectStatus.UNKNOWN;
}

String getProjectStatus(ProjectStatus status) {
  switch (status) {
    case ProjectStatus.OPEN: return "OPEN";
    case ProjectStatus.CLOSED: return "CLOSED";

    // SHOULD NEVER HAPPEN.
    case ProjectStatus.UNKNOWN: return "UNKNOWN";
  }

  return null;
}