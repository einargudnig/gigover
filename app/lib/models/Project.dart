class Project {
  String title;
  String subTitle;
  int daysLeft;
  double amountDone;
  List<String> people;

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
  }

  String get  amountDonePercentage {
    return this.amountDone.toString().substring(0,2) + '%';
  }

  double get amountDoneValue {
    return this.amountDone / 100;
  }

}
