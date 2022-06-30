import 'package:cookie_jar/cookie_jar.dart';
import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:mittverk/models/TaskStatus.dart';

class ApiService {
  static late Dio dio;
  static late CookieJar cookieJar;
  static String apiPrefix = 'https://rest.gigover.com/rest/';

  static setCookieJar() {
    dio.interceptors.add(CookieManager(cookieJar));
  }

  //Get currentTimer
  static Future<Response> getTimer() async {
    return await dio.get(apiPrefix + '/work/current');
  }

  /// Start a timer
  static Future<Response> workStart(int? projectId, int? taskId, int workType) async {
    return await dio
        .post(apiPrefix + '/work/start', data: {'projectId': projectId, 'workType': taskId, 'taskId': taskId});
  }

  /// Stop a timer
  static Future<Response> workEnd(
    int? projectId, {
    String? comment,
  }) async {
    return await dio.post(apiPrefix + '/work/stop', data: {
      'projectId': projectId,
      'comment': comment,
    });
  }

  /// Verify the user you are logged in as
  static Future<Response> verifyUser(String? token) async {
    String url = apiPrefix + '/user/verify';
    Response response = await dio.post(url, data: {'token': token});
    cookieJar.loadForRequest(Uri.parse(url));
    return response;
  }

  /// Register user
  static Future<Response> registerUser(Map<String, dynamic> data) async {
    String url = apiPrefix + '/user/store';
    Response response = await dio.post(url, data: data);
    return response;
  }

  /// Get user notifications
  static Future<Response> projectList() async {
    return await dio.get(apiPrefix + '/workers/list');
  }

  /// Get project details (with comments)
  static Future<Response> getProjectDetails(int projectId) async {
    return await dio.get(apiPrefix + '/workers/' + projectId.toString());
  }

  /// Task details
  static Future<Response> getTaskDetails(int? taskId) async {
    return await dio.get(apiPrefix + '/workers/task/' + taskId.toString());
  }

  /// Add Document (File upload)
  static Future<Response> addDocument({
    required int folderId,
    required int projectId,
    required int taskId,
    required String name,
    required String url,
    required int bytes,
    // required int status,
    int type = 0, // Type IMAGE
  }) async {
    return await dio.post(apiPrefix + '/workers/addDocument', data: {
      'folderId': folderId,
      'projectId': projectId,
      'taskId': taskId,
      'name': name,
      'url': url,
      'bytes': bytes,
      'type': type,
      // status,
    });
  }

  /// Get project types, these are used on tasks
  static Future<Response> getProjectTypes() async {
    return await dio.get(apiPrefix + '/workers/types');
  }

  /// Get a task list for a project
  static Future<Response> getProjectTaskList(int? projectId) async {
    return await dio.get(apiPrefix + '/workers/tasks/' + projectId.toString());
  }

  /// Get user specific info
  ///
  static Future<Response> getUserDetails() async {
    return await dio.get(apiPrefix + '/user/info');
  }

  /// Update a project task status with an optional comment
  static Future<Response> setProjectTaskStatus(
    int? taskId,
    TaskStatus status, {
    String? comment,
  }) async {
    return await dio.post(apiPrefix + '/workers/updateTask', data: {
      'taskId': taskId,
      'status': status.index,
      'comment': comment,
    });
  }

  /// Add a comment to a project task
  static Future<Response> addComment(
    String comment,
    int? projectId,
    int? taskId, {
    bool isContractor = false,
    int? imageId,
  }) async {
    return await dio.post(apiPrefix + '/${!isContractor ? 'workers' : 'contractor'}/comment', data: {
      'imageId': imageId,
      'projectId': projectId,
      'taskId': taskId,
      'comment': comment,
    });
  }

  static storePushToken(String token) async {
    return await dio.post(
      apiPrefix + '/workers/pushToken/' + token,
    );
  }
}
