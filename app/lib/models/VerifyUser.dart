class VerifyUser {

  bool registered;
  int type;
  bool authenticated;

  VerifyUser({ this.registered, this.type, this.authenticated });

  static VerifyUser fromJson(Map<String, dynamic> json) {
    try {
      return VerifyUser(
        registered: json["registered"],
        type: json["type"],
        authenticated: json["authenticated"],
      );
    } catch(e) {
      return null;
    }
  }

}