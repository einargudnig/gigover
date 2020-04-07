
/* Modification */
extension Modification on String {
  String get upperCaseFirst => this.length < 1
    ? this
    : this[0].toUpperCase() + this.substring(1).toLowerCase(); 
}

/* Validation */
extension Validation on String {
  bool get isValidName => !this.contains(RegExp(r'[0–9]'));
  bool get isValidPhoneNumber => RegExp(r'(^(?:[+0]9)?[0-9]{10,12}$)').hasMatch(this);
}

/* Parsing */
extension NumberParsing on String {
  int toInt() {
    return int.parse(this);
  }

  double toDouble() {
    return double.parse(this);
  }
}