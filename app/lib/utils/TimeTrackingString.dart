String timeTrackedFromMinutes(int minutes) {
  String minutesStr = (minutes % 60).toString().padLeft(2, '0');
  int hours = (minutes / 60).truncate();

  if (hours > 0) {
    return '${hours.toString()}h ${minutesStr}m tracked';
  }

  return '${minutesStr}mins tracked';
}