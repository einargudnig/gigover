// TODO Replace old Project model
class NEW_Project {

  int projectId;
  String name;
  String description;
  String zipCode;
  String status; // Convert to enum
  int workId;

  NEW_Project({ this.projectId, this.name, this.description, this.zipCode, this.status, this.workId });

  static NEW_Project fromJson(Map<String, dynamic> json) {
    try {
      return NEW_Project(
        projectId: json["projectId"],
        name: json["name"],
        description: json["description"],
        zipCode: json["zipCode"],
        status: json["status"],
        workId: json["workId"],
      );
    } catch(e) {
      return null;
    }
  }

}