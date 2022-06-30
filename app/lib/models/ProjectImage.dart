class ProjectImage {
  final int? imageId;
  final int? projectId;
  final int? folderId;
  final String? name;
  final String? previewImage;
  final String? url;
  final int? created;
  final int? bytes;
  final int? status;
  final int? taskId;

  const ProjectImage({
    this.projectId,
    this.folderId,
    this.name,
    this.previewImage,
    this.url,
    this.created,
    this.bytes,
    this.status,
    this.taskId,
    this.imageId,
  });

  static ProjectImage fromJson(Map<String, dynamic> json) {
    try {
      json.putIfAbsent('projectId', () => 0);
      json.putIfAbsent('folderId', () => 0);
      json.putIfAbsent('name', () => '');
      json.putIfAbsent('previewImage', () => '');
      json.putIfAbsent('url', () => '');
      json.putIfAbsent('created', () => 0);
      json.putIfAbsent('bytes', () => 0);
      json.putIfAbsent('status', () => 0);
      json.putIfAbsent('taskId', () => 0);
      json.putIfAbsent('imageId', () => 0);

      return ProjectImage(
        projectId: json['projectId'],
        folderId: json['folderId'],
        name: json['name'],
        previewImage: json['previewImage'],
        url: json['url'],
        created: json['created'],
        bytes: json['bytes'],
        status: json['status'],
        taskId: json['taskId'],
        imageId: json['imageId'],
      );
    } catch (e) {
      print(e);
      throw e;
    }
  }
}
