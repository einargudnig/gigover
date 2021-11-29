class ProjectType {
  int? typeId;
  String? name;
  String? image;

  ProjectType({
    this.typeId,
    this.name,
    this.image,
  });

  static ProjectType? fromJson(Map<String, dynamic> json) {
    try {
      return ProjectType(
        typeId: json["typeId"],
        name: json["name"],
        image: json["image"],
      );
    } catch (e) {
      return null;
    }
  }
}
