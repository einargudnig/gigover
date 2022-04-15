class TaskWorker {
  String uId;
  String userName;
  String name;
  int type;

  TaskWorker(
      {this.uId = "unknown",
      this.userName = "Unknown",
      this.name = "Unknown",
      this.type = 0});

  static TaskWorker fromJson(Map<String, dynamic> json) {
    try {
      print(json.toString());
      return TaskWorker(
        uId: json["uId"],
        userName: json["userName"],
        name: json["name"],
        type: json["type"] as int,
      );
    } catch (e) {
      print("Issue in TaskWorker.fromJson");
      print(e);
      throw (e);
    }
  }
}
