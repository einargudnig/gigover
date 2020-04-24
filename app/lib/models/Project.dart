class Task {
  String title;
  String id;

  Task(this.id, this.title);
}

class Project {
  String title;
  String subTitle;
  int daysLeft;
  double amountDone;
  List<String> people;
  List<Task> tasks;

  Project(
      {String title,
      String subTitle,
      int daysLeft,
      double amountDone,
      List<String> people}) {
    this.title = title;
    this.subTitle = subTitle;
    this.daysLeft = daysLeft;
    this.amountDone = amountDone;
    this.people = people;
    this.tasks = [Task('Test', 'test'), Task('Baba', 'afqaf')];
  }

  String get amountDonePercentage {
    return this.amountDone.toString().substring(0, 2) + '%';
  }

  double get amountDoneValue {
    return this.amountDone / 100;
  }
}
