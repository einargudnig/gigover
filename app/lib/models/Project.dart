class Task {
  String title;
  String id;
  List<Comment> comments = [];

  Task(this.id, this.title, this.comments);
}

class Comment {
  String content;
  String userIdFrom; // userId
  String dateSent;

  Comment({this.content, this.userIdFrom, this.dateSent});
}

class Project {
  int id;
  String title;
  String subTitle;
  int daysLeft;
  double amountDone;
  List<String> people;
  List<Task> tasks;

  Project(
      {int id,
      String title,
      String subTitle,
      int daysLeft,
      double amountDone,
      List<String> people}) {
    this.id = id;
    this.title = title;
    this.subTitle = subTitle;
    this.daysLeft = daysLeft;
    this.amountDone = amountDone;
    this.people = people;
    this.tasks = [
      Task('Test', 'test', [
        new Comment(
            content: 'You need to clean up the brush',
            userIdFrom: '1',
            dateSent: new DateTime(2020).toString())
      ]),
      Task('Baba', 'afqaf', [
        new Comment(
            content: 'You need to clean uafafa',
            userIdFrom: '1',
            dateSent: new DateTime(2019).toString())
      ])
    ];
  }

  String get amountDonePercentage {
    return this.amountDone.toString().substring(0, 2) + '%';
  }

  double get amountDoneValue {
    return this.amountDone / 100;
  }
}
