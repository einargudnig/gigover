enum UserType {
  Worker, // 0
  Contractor, // 1
  Store, // 2
  Admin, // 3
}

class VerifyUser {
  String name;
  String zipCode;
  String userName;

  bool registered;
  UserType type;
  bool authenticated;

  VerifyUser(
      {this.name,
      this.zipCode,
      this.userName,
      this.registered,
      this.type,
      this.authenticated});

  static VerifyUser fromJson(Map<String, dynamic> json) {
    try {
      return VerifyUser(
        name: json["name"],
        zipCode: json["zipCode"],
        userName: json["userName"],
        registered: json["registered"],
        type: UserType.values[json["type"]],
        authenticated: json["authenticated"],
      );
    } catch (e) {
      return null;
    }
  }
}
